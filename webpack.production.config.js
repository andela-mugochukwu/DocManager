var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  // The entry file. All your app roots from here.
  entry: [
    // Polyfills go here too, like babel-polyfill or whatwg-fetch
    'babel-polyfill',
    path.join(__dirname, 'client/src/Entry.jsx')
  ],
  // Where you want the output to go
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: 'bundle.js'
  },
  plugins: [
    // webpack gives your modules and chunks ids to identify them. Webpack can vary the
    // distribution of the ids to get the smallest id length for often used ids with
    // this plugin
    // new webpack.optimize.OccurenceOrderPlugin(),

    // // handles creating an index.html file and injecting assets. necessary because assets
    // // change name because the hash part changes. We want hash name changes to bust cache
    // // on client browsers.
    // new HtmlWebpackPlugin({
    //   template: 'client/client.html',
    //   inject: 'body',
    //   filename: 'index.html'
    // }),
    // extracts the css from the js files and puts them on a separate .css file. this is for
    // performance and is used in prod environments. Styles load faster on their own .css
    // file as they dont have to wait for the JS to load.
    new ExtractTextPlugin({
      filename: 'style.css',
    }),
    // handles uglifying js
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     warnings: false,
    //     screw_ie8: true
    //   }
    // }),
    new UglifyJsPlugin(),
    new CleanWebpackPlugin(path.join(__dirname, '/client/dist')),
    // creates a stats.json
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    // plugin for passing in data to the js, like what NODE_ENV we are in.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  // // ESLint options
  // eslint: {
  //   configFile: '.eslintrc',
  //   failOnWarning: false,
  //   failOnError: true
  // },

  module: {
    // // Runs before loaders
    // preLoaders: [
    //   {
    //     test: /\.js$/,
    //     exclude: /node_modules/,
    //     loader: 'eslint'
    //   }
    // ],
    // loaders handle the assets, like transforming sass to css or jsx to js.
    rules: [
      {
      test: /.jsx?$/,
      include: [path.join(__dirname, 'client/src')],
      exclude: /node_modules/,
      loader: ['babel-loader']
    }, {
      test: /\.json?$/,
      loader: 'json-loader'
    }, {
      test: /\.scss$|\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        // resolve-url-loader may be chained before sass-loader if necessary
        use: ['css-loader', 'sass-loader'],
      }),
    }, {
      test: /\.woff2?(\?[a-z0-9#=&.]+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.(ttf|eot|svg)(\?[a-z0-9#=&.]+)?$/,
      loader: 'file-loader'
    }]
  }
};
