const jsonfile = require('jsonfile');

const run = () => {
  jsonfile.readFile(`${__dirname}/dummyData.json`, function (err, dummyData) {
    jsonfile.readFile(`${__dirname}/dummyTypes.json`, function (err, dummyTypes) {
      require('..')(dummyData, dummyTypes);
    });
  });
}

run();
