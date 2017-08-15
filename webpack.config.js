const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: [
    'eventsource-polyfill',
    'webpack-hot-middleware/client',
    path.join(__dirname, 'client/Entry.jsx')
  ],
  devtool: 'eval-source-map',
  target: 'web',
  output: {
    path: path.join(__dirname, '/client/assets/js'),
    filename: 'bundle.js',
    publicPath: path.join(__dirname, '/client/assets')
  },
  devServer: {
    contentBase: `${__dirname}/client`
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: '../css/style.css',
      allChunks: true
    }),
  ],
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        include: [path.join(__dirname, 'client'),
          path.join(__dirname, 'server/shared')
        ],
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot-loader', 'babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=100000',
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
