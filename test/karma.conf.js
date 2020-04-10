module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'node_packages/angular/angular.js',
      'node_packages/angular-resource/angular-resource.js',
      'node_packages/angular-mocks/angular-mocks.js',
      'app/*.js',
      'app/**/*.js',
      'node_packages/moment/moment.js'
    ],

    exclude : [
      'app/lib/angular/angular-loader.js',
      'app/lib/angular/*.min.js',
      'app/lib/angular/angular-scenario.js',
      'app/**/scenarios.test.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
