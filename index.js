'use strict';
// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// Consts
var PLUGIN_NAME = 'gulp-xray-runner';

// var rimraf = require('rimraf');
var es = require('event-stream');
var gutil = require('gulp-util');
var path = require('path');

module.exports = function (options, cb) {
  gutil.log(gutil.colors.cyan('Options: '), options);

    // TODO: Add support for argument in command line: grunt xray --files=fail.xqy
    var verbose = (options.verbose !== undefined) ? options.verbose : false;
    var async = require('async');
    var path = require('path');
    var _ = require('lodash');
    var request = require('request');
    var util = require('util');

    // Validate task settings    
    // var settings = this.data.settings;
    
    if (! Array.isArray(options.modules)) {
      options.modules = [options.modules];
    }
    if (options === undefined) {
      throw new PluginError(PLUGIN_NAME, 'Invalid configuration [options] should be:\n' + 
        JSON.stringify({options:{url:'http://localhost:9000/xray', testDir: 'app/lib/test'}}, null, 2));
    }

    if (verbose) {
      gutil.log('name [' + this.name + '] - target [' + this.target + ']');
      gutil.log('data ' + JSON.stringify(options, null, 1));
    }

    var done = cb;//this.async();
    // var options = {verbose: verbose};
    var Runner = require('./lib/runner');
    var runner = new Runner(options);

    var errorMessages = [];
    var failedMessages = [];
    var total = 0;
    var passed = 0;
    var ignored = 0;
    var failed = 0;

    function showReport(results) {
      total += results.total;
      passed += results.passed;
      ignored += results.ignored;
      failed += results.failed;
      _.each(results.reports, function(report) {
        errorMessages = errorMessages.concat(report.errorMessages);
        failedMessages = failedMessages.concat(report.failedMessages);
      });
    }
    
    function executeModuleTest(module, callback) {
      gutil.log('Execute XRay unit test for module [' + module + ']');
      var options = runner.getRequestOptions(module)
      request.post(options, function(error, response, body) {

        if (!error && response.statusCode === 200) {
          gutil.log(body);
          body = JSON.parse(body);
          if (verbose) {
            gutil.log('tests \n\n' + JSON.stringify(body.tests, null, 2));
          }
          runner.parseResponse(body.tests, showReport);
        } else {
          if (verbose) {
            gutil.log('Request failed \n\n' + JSON.stringify(response.body, null, 2));
          }
          throw new PluginError(PLUGIN_NAME, 'Request failed code status [' + response.statusCode + '] for module: ' + module);
        }
        callback();
      });
    }

    async.eachSeries(
      options.modules, 
      executeModuleTest,
      function(err) {
        if (failedMessages.length > 0) {
          throw new PluginError(PLUGIN_NAME, failedMessages.join('\n'));
        }
        if (errorMessages.length > 0) {
          throw new PluginError(PLUGIN_NAME, errorMessages.join('\n'));
        }
        gutil.log('Total [' + total + '] - passed [' + passed + '] - ignored [' + ignored + '] - failed [' + failed + ']');
        gutil.log(gutil.colors.cyan('OK'));
        done();
      }
    );

    // throw new PluginError(PLUGIN_NAME, "Missing prefix text!");
    
};
