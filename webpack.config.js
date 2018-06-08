const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    path.join(__dirname, 'client/src/Entry.jsx')
  ],
  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'bundle.js'
  },
  node: {
    console: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(path.join(__dirname, '/client/dist')),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '/client/src/assets/images/document-manager.jpg'),
        to: path.join(__dirname, '/client/dist/images') }
    ], {
      debug: true
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /.jsx?$/,
        include: [path.join(__dirname, 'client')
        ],
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot-loader', 'babel-loader']
      },
      {
        test: /\.woff2?(\?[a-z0-9#=&.]+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.scss$|\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?[a-z0-9#=&.]+)?$/,
        loader: 'file-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
