const contentfulExport = require('contentful-export');
const mungeContent = require('./mungeContent');
const mungeTypes = require('./mungeTypes');

module.exports = (fallback, cb, generator) => {
  require('jsonfile').readFile(`${__dirname}/config.json`, function (err, config) {
    if (err) {
      console.error(err);
      if(cb) cb({}, {});
      return;
    }

    contentfulExport({
      spaceId: config.contentfulSpaceId,
      managementToken: config.contentfulPersonalAccessToken,
      skipRoles: true,
      skipWebhooks: true,
      saveFile: false,
    }).then((result) => {
      if (!result.contentTypes.length) {
        console.log("webhook2contentful ~~~> You've setup webhook2contentful properly, but it appears you haven't run `grunt migrateToContentful` yet, because your contentful space has no content types! For now, we're falling back to the old firebase DB.");
        fallback(cb);
      } else {
        //return fallback(cb);

        //return fallback((webhookContent, webhookTypes) => {
        //  const has = Object.values(webhookTypes).find(type => type.controls.find(c => c.controlType === "boolean") );
        //  console.log(has.controls.find(c => c.controlType === "boolean"));
        //  cb(webhookContent, webhookTypes); 
        //});

        console.log("webhook2contentful ~~~> Your Contentful Space isn't empty. Using that instead of firebase!");

        const mungedTypes = mungeTypes(result, config);
        const mungedContent = mungeContent(result, config, mungedTypes);
        Object.keys(mungedTypes).forEach(typeKey => {
          if (typeKey.endsWith("_subitem")) delete mungedTypes[typeKey];
        });
        Object.keys(mungedContent).forEach(typeKey => {
          if (typeKey.endsWith("_subitem")) delete mungedContent[typeKey];
        });

        generator.cachedData = {
          //data: loadIntoGetterMagic(mungedContent, mungedTypes),
          data: mungedContent,
          typeInfo: mungedTypes,
          settings: {}
        };

        swigFunctions.setData(mungedContent);
        swigFunctions.setTypeInfo(mungedTypes);
        swigFunctions.setSettings({});
        swigFilters.setTypeInfo(mungedTypes);

        fallback(cb);
      };
    }).catch((err) => {
      console.log('Oh no! Some errors occurred!', err)
    });
  });
}
