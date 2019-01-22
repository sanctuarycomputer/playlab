const Types = {
  SYMBOL: 'Symbol',
  TEXT: 'Text',
  INTEGER: 'Integer',
  NUMBER: 'Number',
  DATE: 'Date',
  BOOLEAN: 'Boolean',
  OBJECT: 'Object',
  LOCATION: 'Location',
  RICH_TEXT: 'RichText',
  ARRAY: 'Array',
  LINK: 'Link',
  ENTRY: 'Entry',
  ASSET: 'Asset'
};

const Widgets = {
  DROPDOWN: 'dropdown',
  URL_EDITOR: 'urlEditor',
  SLUG_EDITOR: 'slugEditor',
  BOOLEAN: 'boolean',
  ENTRY_LINKS_EDITOR: 'entryLinksEditor',
  ASSET_GALLERY_EDITOR: 'assetGalleryEditor'
};

const WebhookFieldMappings = {
  'textfield': {
    contentfulType: Types.TEXT
  },
  'textarea': {
    contentfulType: Types.TEXT
  },
  'datetime': {
    contentfulType: Types.DATE
  },
  'markdown': {
    contentfulType: Types.TEXT
  },
  'url': {
    contentfulType: Types.SYMBOL,
  },
  'email': {
    contentfulType: Types.SYMBOL
  },
  'color': {
    contentfulType: Types.SYMBOL
  },
  'boolean': {
    contentfulType: Types.BOOLEAN,
  },
  'select': {
    contentfulType: Types.SYMBOL
  },
  'relation': {},
  'image': {},
  'gallery': {},
  'grid': {},
}

const buildWebhookControlForContentType = (migration, ContentType, control, detectedInverseRelationships) => {
  if (detectedInverseRelationships.includes(control.name)) {
    console.warn(`Ignoring relationship ${control.name} as it appears to be inverse`);
    return; 
  }

  // Ignore Timestamps
  if (["create_date", "last_updated", "publish_date", "preview_url"].includes(control.name)) return;

  const controlMapping = WebhookFieldMappings[control.controlType];
  if (!controlMapping) throw new Error(`No mapping for webhook control: ${control.controlType}`);
  let defaultValidations = controlMapping.contentfulValidations || [];

  // Break Grid Types into subtypes
  if (control.controlType === 'grid') {
    const GridSubItemContentType = buildWebhookType(migration, `${control.name}_subitem`, `${control.label} Subitem`);
    control.controls.forEach(control => {
      buildWebhookControlForContentType(migration, GridSubItemContentType, control, []);
    });
  }

  // Init the default field
  const Field = ContentType.createField(control.name)
    .name(control.label)
    .required(control.required);

  let type = controlMapping.contentfulType;

  // Deal with the trippy types
  if (control.controlType === 'relation') {
    if (control.meta.isSingle) {
      Field.type(Types.LINK).linkType(Types.ENTRY);
      defaultValidations = [...defaultValidations, {
        linkContentType: [control.meta.contentTypeId]
      }];
    } else {
      Field.type(Types.ARRAY).items({
        type: Types.LINK,
        linkType: Types.ENTRY,
        validations: [{
          linkContentType: [control.meta.contentTypeId]
        }]
      });
    }
    ContentType.changeEditorInterface(control.name, Widgets.ENTRY_LINKS_EDITOR, {
      bulkEditing: true
    });
  } else if (control.controlType === 'grid') {
    Field.type(Types.ARRAY).items({
      type: Types.LINK,
      linkType: Types.ENTRY,
      validations: [{
        linkContentType: [`${control.name}_subitem`]
      }]
    });
    ContentType.changeEditorInterface(control.name, Widgets.ENTRY_LINKS_EDITOR, {
      bulkEditing: true
    });
  } else if (control.controlType === 'image') {
    Field.type(Types.LINK).linkType(Types.ASSET);
    defaultValidations = [...defaultValidations, {
      linkMimetypeGroup: ['image']
    }];
  } else if (control.controlType === 'gallery') {
    Field.type(Types.ARRAY).items({
      type: Types.LINK,
      linkType: Types.ASSET,
      validations: [{
        linkMimetypeGroup: ['image']
      }]
    });
    ContentType.changeEditorInterface(control.name, Widgets.ASSET_GALLERY_EDITOR, {
      bulkEditing: true
    });
  } else {
    Field.type(controlMapping.contentfulType);
  }

  // Editors & Extra Validations
  switch(control.controlType) {
    case 'url':
      ContentType.changeEditorInterface(control.name, Widgets.URL_EDITOR);
      break;

    case 'select':
      ContentType.changeEditorInterface(control.name, Widgets.DROPDOWN);
      const { options } = control.meta;
      defaultValidations = [...defaultValidations, {
        in: options.map(o => o.value)
      }];
      break;

    case 'boolean':
      let { falseLabel, trueLabel } = control.meta;
      if (!falseLabel) falseLabel = "No";
      if (!trueLabel) falseLabel = "Yes";
      ContentType.changeEditorInterface(control.name, Widgets.BOOLEAN, {
        trueLabel, falseLabel
      });
      break;
  };

  if (control.name === 'slug') {
    ContentType.changeEditorInterface(control.name, Widgets.SLUG_EDITOR);
  }

  // Apply Validations
  if (defaultValidations.length) {
    Field.validations(defaultValidations);
  }
}

const buildWebhookType = (migration, key, name) => {
  return migration.createContentType(key).name(name);
}

const cherrypickFields = (webhookData, contentType) => {
  return webhookType.controls.reduce((data, control) => {

    contentType.fields.forEach(field => {
    });

  if (control.controlType === 'relation') {
  } else if (control.controlType === 'grid') {
  } else if (control.controlType === 'image') {
  } else if (control.controlType === 'gallery') {
  } else {
    // Primitves
      
  }
    
  }, {});
}


module.exports = function (migration, context) {
  const { webhookData, webhookTypes } = global.webhook2contentful;

  // Build Data
  //Object.keys(webhookData).forEach(webhookKey => {
  //  const webhookType = webhookTypes[webhookKey];
  //  if (!webhookType) return;
  //  const webhookDataset = webhookData[webhookKey];
  //  createContentfulDataset(client, webhookKey, webhookType, webhookDataset, detectedInverseRelationships[webhookKey]);
  //});

  createContentfulDataset(null, 'home', webhookTypes['home'], webhookData['home'], detectedInverseRelationships['home']);

  //console.log(webhookTypes['home'].oneOff)
  //console.log(webhookData['home']);


  return;

  // Build our Main content types
  const ContentTypeTuples = Object.keys(webhookTypes).map(webhookKey => {
    const webhookType = webhookTypes[webhookKey];
    return { ContentType: buildWebhookType(migration, webhookKey, webhookType.name), webhookKey };
  });

  // Populate Content Types fields 
  ContentTypeTuples.forEach(({ ContentType, webhookKey }) => {
    webhookTypes[webhookKey].controls.forEach(control => {
      buildWebhookControlForContentType(migration, ContentType, control, detectedInverseRelationships[webhookKey])
    });
  });

  //const GlobalSettings = migration.createContentType('settings')
  //  .name('Global Settings')
  //  .description('The global settings for this website.');

  //GlobalSettings.createField('site_description')
  //  .name('Site Description')
  //  .type(Types.SYMBOL);

  //GlobalSettings.createField('site_facebook')
  //  .name('Site Facebook')
  //  .type(Types.SYMBOL);

  //GlobalSettings.createField('site_keywords')
  //  .name('Site Keyworkds')
  //  .type(Types.SYMBOL);
};
