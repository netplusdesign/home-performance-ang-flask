exports.config = {
  allScriptsTimeout: 60000,

  specs: [
    '../app/yearly/scenarios.test.js',
    '../app/monthly/scenarios.test.js',
    '../app/daily/scenarios.test.js',
    '../app/hourly/scenarios.test.js'
  ],

  capabilities: {
    browserName: 'firefox'
  },

  baseUrl: 'http://127.0.0.1',

  framework: 'jasmine',

  directConnect: true,
  //seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }
};
