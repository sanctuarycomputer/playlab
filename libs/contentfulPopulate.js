const contentful = require('contentful-management');

const SKIP_ASSETS = true;

// TODO: Display Fields
// TODO: Slug doesn't seem to work right
// TODO: Seems like Mardown is the default
// TODO: Persist grid items eventually
// TODO: Variablize stuff

const ENTRY_TYPES = ['Link', 'Array']; 

const cherrypickFields = (webhookDataset, fields, webhookId) => {
  const memo = {};
  if (webhookId) memo.__WEBHOOK_ID__ = webhookId;

  return fields.reduce((acc, field) => {
    acc[field.id] = {
      'en-US': webhookDataset[field.id]
    };

    if (field.type === 'Array') {
      if (field.items.linkType === 'Asset') {
        acc.__BUILD_ASSETS__[field.id] = webhookDataset[field.id];
      } else {
        acc.__RESOLVE_LINKS__ = [...acc.__RESOLVE_LINKS__, field.id];
      }
    }

    if (field.type === 'Link') {
      if (field.linkType === 'Asset') {
        acc.__BUILD_ASSETS__[field.id] = webhookDataset[field.id];
      } else {
        acc.__RESOLVE_LINKS__ = [...acc.__RESOLVE_LINKS__, field.id];
      }
    }

    return acc;
  }, { 
    ...memo,
    __RESOLVE_LINKS__: [],
    __BUILD_ASSETS__: {},
  });
}

const createAsset = (environment, assetBlueprintItem) => {
  // It's possible for webhook to store a file without
  // a content type, so let's ignore it
  if (!assetBlueprintItem.type) return Promise.resolve();

  const splat = assetBlueprintItem.url.split('/');
  const filename = splat[splat.length - 1];
  console.log(`🖼 ~~~> Uploading ${filename} to Contentful.`);
  return environment.createAsset({
    fields: {
      title: { 'en-US': filename },
      file: {
        'en-US': {
          contentType: assetBlueprintItem.type,
          fileName: filename,
          upload: `http://playlab.webhook.org${assetBlueprintItem.url}`
        }
      }
    }
  }).then(asset => {
    return asset.processForAllLocales().then(asset => asset.publish());
  });
}

const buildAssetsForObject = async(environment, obj) => {
  const objKeyResolvers = Object.keys(obj.__BUILD_ASSETS__).reduce((acc, assetKey) => {
    let assetBlueprint = obj.__BUILD_ASSETS__[assetKey];
    let arrayifiedAssetBlueprint = Array.isArray(assetBlueprint) ? assetBlueprint : [assetBlueprint];

    let processedAssets = [];

    const build = arrayifiedAssetBlueprint.reduce((acc, assetBlueprintItem) => {
      if (!assetBlueprintItem) return acc;
      return acc.then(() => {
        return createAsset(environment, assetBlueprintItem).then(asset => {
          processedAssets.push(asset);
          return asset;
        });
      });
    }, Promise.resolve());
      
    return acc.then(() => build.then(() => {
      obj.__BUILD_ASSETS__[assetKey] = Array.isArray(assetBlueprint) ? processedAssets : processedAssets[0];
      return processedAssets;
    }));
  }, Promise.resolve());

  // Wait until all assets are built
  await objKeyResolvers;

  // Bring newly created assets back into the fieldset
  Object.keys(obj.__BUILD_ASSETS__).forEach(key => {
    const assetResult = obj.__BUILD_ASSETS__[key];
    if (!assetResult) return;

    if (Array.isArray(assetResult)) {
      obj[key] = { 
        'en-US': assetResult.map(asset => ({
          sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id }
        }))
      };
    } else {
      obj[key] = { 
        'en-US': { 
          sys: { type: 'Link', linkType: 'Asset', id: assetResult.sys.id }
        } 
      };
    }
    delete obj.__BUILD_ASSETS__[key];
  });
  return Promise.resolve(obj);
};

const createContentfulDataset = async (
  environment, 
  contentType,
  webhookKey, 
  webhookType, 
  webhookDataset, 
  detectedInverseRelationships
) => {
  let workingSet;
  if (webhookType.oneOff) {
    workingSet = [cherrypickFields(webhookDataset, contentType.fields, false)];
  } else {
    workingSet = Object.keys(webhookDataset).map(webhookId => {
      const itemData = webhookDataset[webhookId];
      return cherrypickFields(itemData, contentType.fields, webhookId);
    });
  }

  if (SKIP_ASSETS) {
    workingSet.forEach(obj => {
      Object.keys(obj.__BUILD_ASSETS__).forEach(key => {
        delete obj[key];
      });
    });
    console.log(`✅ ~~~> Skipping assets for ${webhookKey}`);
  } else {
    await workingSet.reduce((acc, obj) => {
      return acc.then(() => buildAssetsForObject(environment, obj));
    }, Promise.resolve());
    console.log(`✅ ~~~> Finished building assets for ${webhookKey}`);
  }
 
  // Attempt to persist the dataset itself
  let persisted = false; 
  let persistedWorkingSet = {};

  if (workingSet.some(obj => obj.__RESOLVE_LINKS__.length > 0)) {
    console.log(`🚫 ~~~> Couldn't persist ${webhookKey} yet, as further links are required.`);
  } else {
    await workingSet.reduce((acc, fields) => {
      let webhookId;
      if (fields.__WEBHOOK_ID__) {
        webhookId = fields.__WEBHOOK_ID__;
        delete fields.__WEBHOOK_ID__;
      }
      delete fields.__RESOLVE_LINKS__;
      delete fields.__BUILD_ASSETS__;
      return acc.then(() => {
        return environment.createEntry(webhookKey, { fields }).then(entry => {
          return entry.publish().then(entry => {
            console.log(`✅ ~~~> Published ${webhookKey}.`, webhookId);
            if (webhookId) {
              persistedWorkingSet[webhookId] = entry;
            } else {
              persistedWorkingSet['oneOff'] = entry;
            }
            return entry;
          });
        });
      });
    }, Promise.resolve());
    persisted = true;
    console.log(`✅ ~~~> Did persist ${webhookKey} as all links were resolved on first pass.`);
  }

  if (persisted) {
    persistedWorkingSet = webhookType.oneOff ? persistedWorkingSet['oneOff'] : persistedWorkingSet;
    return await Promise.resolve({
      workingSet: persistedWorkingSet, persisted: true
    });
  } else {
    workingSet = webhookType.oneOff ? workingSet[0] : workingSet;
    return await Promise.resolve({
      workingSet, persisted: false
    });
  }
}

const findPersistedEntryForRelation = (persisted, webhookRelation) => {
  const splat = webhookRelation.split(' ');

  if (splat.length === 2) {
    // Refers to something in a collection
    const [webhookKey, webhookId] = splat;
    if (persisted[webhookKey] && persisted[webhookKey][webhookId]) {
      return persisted[webhookKey][webhookId];
    }
    return false;
  } else if (splat.length === 1) {
    // Refers to a singleton
    const webhookKey = splat[0];
    if (persisted[webhookKey]) {
      return persisted[webhookKey];
    }
    return false;
  }

  console.log("!!! SPLAT WEIRD", splat);
  return false;
};

const resolveLinksForObject = (obj, persisted, webhookType) => {
  obj.__RESOLVE_LINKS__.forEach(key => {
    const unresolved = obj[key]['en-US'];

    // TODO: Persist grid items eventually
    const control = webhookType.controls.find(c => c.name === key);
    if (control.controlType === 'grid') {
      delete obj[key];
      obj.__RESOLVE_LINKS__ = obj.__RESOLVE_LINKS__.filter(unresolvedKey => unresolvedKey !== key);
      return;
    }

    if (Array.isArray(unresolved)) {
      // Relationship not populated, ignore this key
      if (unresolved.length === 0) {
        obj.__RESOLVE_LINKS__ = obj.__RESOLVE_LINKS__.filter(unresolvedKey => unresolvedKey !== key);
        return;
      }
      const entries = unresolved.map(webhookRelation => {
        return findPersistedEntryForRelation(persisted, webhookRelation);
      });
      if (entries.every(entry => entry === false)) return;
      if (entries.some(entry => entry === false)) {
        console.log(`!!! BAD CASE -> ${key}`, webhookType.name, obj);
        return;
      }

      obj[key] = { 
        'en-US': entries.map(entry => ({
          sys: { type: 'Link', linkType: 'Entry', id: entry.sys.id }
        }))
      };
      obj.__RESOLVE_LINKS__ = obj.__RESOLVE_LINKS__.filter(unresolvedKey => unresolvedKey !== key);
    } else {
      // Relationship not populated, ignore this key
      if (!unresolved) {
        obj.__RESOLVE_LINKS__ = obj.__RESOLVE_LINKS__.filter(unresolvedKey => unresolvedKey !== key);
        return;
      }
      const entry = findPersistedEntryForRelation(persisted, unresolved);
      if (!entry) return;
      obj[key] = { 
        'en-US': { 
          sys: { type: 'Link', linkType: 'Entry', id: entry.sys.id }
        } 
      };
      obj.__RESOLVE_LINKS__ = obj.__RESOLVE_LINKS__.filter(unresolvedKey => unresolvedKey !== key);
    }
  });
}

const resolveLinksForCollection = (collection, persisted, webhookType) => {
  Object.values(collection).forEach(obj => {
    resolveLinksForObject(obj, persisted, webhookType);
  });
};

let passes = 0;
const resolveLinksAcrossStack = (environment, stack, webhookTypes) => {
  passes++
  console.log(`🔥 ~~~> Starting link resolution pass: ${passes}.`);

  const chain = Object.keys(stack.waiting).reduce((acc, webhookKey) => {
    return acc.then(() => {

      const workingSet = stack.waiting[webhookKey];

      if (Array.isArray(workingSet)) {
        resolveLinksForCollection(workingSet, stack.persisted, webhookTypes[webhookKey]);
        if (workingSet.some(obj => obj.__RESOLVE_LINKS__.length > 0)) {
          console.log(`🚫 ~~~> Couldn't persist ${webhookKey} yet, as further links are required.`);
          return Promise.resolve();
        } else {
          console.log(`⌛ ~~~> Did resolve all links for ${webhookKey} on pass: ${passes}, beginning persistance!`);

          let persistedWorkingSet = {};
          const chain = workingSet.reduce((acc, fields) => {
            let webhookId;
            if (fields.__WEBHOOK_ID__) {
              webhookId = fields.__WEBHOOK_ID__;
              delete fields.__WEBHOOK_ID__;
            }
            delete fields.__RESOLVE_LINKS__;
            delete fields.__BUILD_ASSETS__;
            return acc.then(() => environment.createEntry(webhookKey, { fields }).then(entry => {
              return entry.publish().then(entry => {
                if (webhookId) {
                  persistedWorkingSet[webhookId] = entry;
                }
                console.log(`🙄 ~~~> Did persist a ${webhookKey} record, moving on...`);
                return entry;
              });
            }));
          }, Promise.resolve());

          return chain.then(() => {
            console.log(`✅ ~~~> Did persist all items for ${webhookKey} on pass: ${passes}.`);
            delete stack.waiting[webhookKey]
            stack.persisted[webhookKey] = persistedWorkingSet;
            return;
          });
        }
      } else {
        resolveLinksForObject(workingSet, stack.persisted, webhookTypes[webhookKey]);
        if (workingSet.__RESOLVE_LINKS__.length > 0) {
          console.log(`🚫 ~~~> Couldn't persist ${webhookKey} yet, as further links are required.`);
          return Promise.resolve();
        } else {
          console.log(`⌛ ~~~> Did resolve all links for ${webhookKey} on pass: ${passes}, beginning persistance!`);
          delete workingSet.__RESOLVE_LINKS__;
          delete workingSet.__BUILD_ASSETS__;
          return environment.createEntry(webhookKey, { fields: workingSet }).then(entry => {
            return entry.publish().then(entry => {
              console.log(`✅ ~~~> Did persist oneOff item for ${webhookKey} on pass: ${passes}.`);
              delete stack.waiting[webhookKey]
              stack.persisted[webhookKey] = entry;
              return entry;
            });
          });
        }
      }

    });
  }, Promise.resolve());

  return chain.then(() => {
    if (Object.keys(stack.waiting).length > 0) {
      console.log("🎇 !!! Pass completed, we're going in again!");
      return resolveLinksAcrossStack(environment, stack, webhookTypes);
    } else {
      return Promise.resolve();
    }
  });
};

module.exports = async function({ webhookData, webhookTypes, detectedInverseRelationships }) {
  const client = contentful.createClient({
    accessToken: 'CFPAT-317a6d8f97b261601a6f61f097342c2219dcfef5ce176fb37705d9df8f73a085', // TODO: variable
  });

  console.log(`⌛ ~~~> Loading your Contentful space data...`);
  const space = await client.getSpace('a8mx6djbd6sl'); // TODO: variable
  const environment = await space.getEnvironment('master');

  /* Preload the Content Types */
  const ContentTypes = {};
  await (Object.keys(webhookData).reduce((acc, webhookKey) => {
    const webhookType = webhookTypes[webhookKey];
    if (!webhookType) return acc;
    return acc.then(() => {
      console.log(`~~~> Loading Contentful content type: ${webhookKey}`);
      return environment.getContentType(webhookKey).then(contentType => {
        ContentTypes[webhookKey] = contentType;
        return;
      })
    });
  }, Promise.resolve()));
  console.log(`✅ ~~~> Loaded your Contentful space data!`);

  /* Let's take a pass */
  const stack = { persisted: {}, waiting: {} };

  await Object.keys(webhookData).reduce((acc, webhookKey) => {
    const webhookType = webhookTypes[webhookKey];
    if (!webhookType) return acc;
    const webhookDataset = webhookData[webhookKey];

    return acc.then(() => {
      console.log(`🔨 ~~~> Taking initial pass for: ${webhookKey}`);
      return createContentfulDataset(
        environment, 
        ContentTypes[webhookKey], 
        webhookKey, 
        webhookType, 
        webhookDataset
      ).then(({ persisted, workingSet }) => {
        if (persisted) {
          stack.persisted[webhookKey] = workingSet;
        } else {
          stack.waiting[webhookKey] = workingSet;
        }
        return;
      });
    });
  }, Promise.resolve());

  await resolveLinksAcrossStack(environment, stack, webhookTypes);
}
