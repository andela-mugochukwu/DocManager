'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var port = parseInt(process.env.PORT, 10) || 1844;
_app2.default.set('port', port);

var server = _http2.default.createServer(_app2.default);
if (process.env.NODE_ENV === 'development') {
  console.log('running on port', port, 'in', process.env.NODE_ENV);
}

server.listen(port);