// TODO: resize URLs
// TODO: Global site settings
// TODO: Validate Logging 

const runMigration = require('contentful-migration/built/bin/cli').runMigration

module.exports = (webhookData, webhookTypes, webhookSettings, done, cb) => {
  const detectedInverseRelationships = require(`./detectInverseRelationships`)(webhookTypes);

  require('jsonfile').readFile(`${__dirname}/config.json`, function (err, config) {
    if (err) {
      console.error(err);
      if (cb) cb(done);
      return;
    }

    global.webhook2contentful = {
      ...config,
      webhookData,
      webhookTypes,
      webhookSettings,
      detectedInverseRelationships,
    }; 

    runMigration({
      filePath: `${__dirname}/migrate.js`,
      spaceId: global.webhook2contentful.contentfulSpaceId,
      accessToken: global.webhook2contentful.contentfulPersonalAccessToken,
    }).then(() => {
      return new Promise((resolve, reject) => {
        require('jsonfile').writeFile(`${__dirname}/generatedMeta.json`, {
          oneOff: global.webhook2contentful.oneOff
        }, function(err) {
          if (err) return reject(err);
          require(`${__dirname}/populate.js`)(global.webhook2contentful).then(resolve).catch(reject);
        });
      });
    }).catch(console.error).finally(() => { if(cb) cb(done); });
  });
}
