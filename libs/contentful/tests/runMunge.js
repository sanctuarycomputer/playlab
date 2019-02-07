const jsonfile = require('jsonfile');
const jsonDiff = require('json-diff');

const run = () => {
  jsonfile.readFile(`${__dirname}/dummyData.json`, function (err, dummyData) {
    jsonfile.readFile(`${__dirname}/dummyTypes.json`, function (err, dummyTypes) {

      require('../munge')(f => f, (data, types) => {
        console.log(jsonDiff.diffString(data, dummyData))
      });

    });
  });
}

run();
