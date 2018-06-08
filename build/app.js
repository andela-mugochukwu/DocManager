'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _routes = require('./routes/routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Set up the express app
var app = (0, _express2.default)();
var router = _express2.default.Router();
if (process.env.NODE_ENV === 'development') {
  var config = require('../webpack.config');
  var Webpack = require('webpack');
  var webpackdevmiddleware = require('webpack-dev-middleware');
  var webpackhotmiddleware = require('webpack-hot-middleware');
  var compiler = Webpack(config);

  app.use(webpackdevmiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    historyApiFallback: true,
    hot: true
  }));

  app.use(webpackhotmiddleware(compiler));
}

// set static path
var sourcePath = _express2.default.static(_path2.default.join(__dirname, '../client/dist'));
app.use('/static', sourcePath);

// Log requests to the console.
app.use((0, _morgan2.default)('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(_bodyParser2.default.json({ limit: '50mb' }));
app.use(_bodyParser2.default.urlencoded({ extended: false }));

app.use('/api/v1', router);
// get all routes
(0, _routes2.default)(router);

app.get('/*', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, '../client/index.html'));
});

module.exports = app;