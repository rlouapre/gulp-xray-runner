# gulp-xray-runner

> This plugin uses XRay Test Framework to automate testing of XQuery in Marklogic

## Getting Started
This plugin requires Gulp `~3.6.0`

```shell
npm install https://github.com/rlouapre/gulp-xray-runner/tarball/v0.0.1 --save-dev
```

## Usage

```javascript
var xray = require('gulp-xray-runner')

gulp.task('xray', function (cb) {
  var options = {
  /* https://github.com/mikeal/request#http-authentication */
    auth: {
      username: 'admin',
      password: 'secret',
      sendImmediately: false
    },
    url: 'http://localhost:9300/_framework/lib/xray',
    testDir: '_framework/test',
    files: ['_framework/test/**/*.xqy']
  };
  xray(options, cb);
});

```

### Options

#### options.url
Type: `String`

Base url of ML application server (XRay must be installed and available in ```{settings.url}/xray``` directory).

#### options.testDir
Type: `String`
Default value: `test`

Directory name where unit test are located.

#### options.files
Type: `String Array`

Unit test files to execute (support matching globbing pattern).

#### options.auth
Type: `Object`
Credentials to access ML application server

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Gulp](https://github.com/gulpjs/gulp/tree/master/docs/writing-a-plugin).

## Release History
_(Nothing yet)_
