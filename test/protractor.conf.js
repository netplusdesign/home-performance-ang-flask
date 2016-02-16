exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '../app/yearly/scenarios.test.js',
    '../app/monthly/scenarios.test.js',
    '../app/daily/scenarios.test.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  chromeOnly: true,

  baseUrl: 'http://127.0.0.1:5000',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
