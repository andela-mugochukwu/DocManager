module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: '**/spec/run.js', watched: false }
    ],
    preprocessors: {
      '**/server/controller/*.js': ['coverage']
    },
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-coverage'
    ],
    reporters: ['progress', 'coverage'],
    port: 1845,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autowatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
    coverageReporter: {
      includeAllSources: true,
      dir: 'coverage/Server',
      reporters: [
        //{ type: 'html', subdir: 'html' },
        {type:'lcovonly', subdir: '.'},
        // { type: 'text-summary' }
      ]
    }
  });
};
