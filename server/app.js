import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './routes/routes';
// Set up the express app
const app = express();
const router = express.Router();
if (process.env.NODE_ENV === 'development') {
  const config = require('../webpack.config');
  const Webpack = require('webpack');
  const webpackdevmiddleware = require('webpack-dev-middleware');
  const webpackhotmiddleware = require('webpack-hot-middleware');
  const compiler = Webpack(config);

  app.use(webpackdevmiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    historyApiFallback: true,
    hot: true
  }));

  app.use(webpackhotmiddleware(compiler));
}

// set static path
const sourcePath = express.static(path.join(__dirname, '../client/dist'));
app.use('/static', sourcePath);

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', router);
// get all routes
routes(router);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

module.exports = app;
