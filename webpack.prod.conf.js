const webpack = require('webpack')
const BabiliPlugin = require('babili-webpack-plugin')
const path = require('path')
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin
const LessPluginCleanCSS = require('less-plugin-clean-css')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: `${__dirname}/app`,
  devtool: 'cheap-module-source-map',
  entry: {
    app: [
      './Router?main',
    ],
    splash: [
      './splash.js',
      './Styles/splash.less',
    ],
  },
  output: {
    path: `${__dirname}/build/public`,
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      },
      { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' },
      { test: /\.woff$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot$/, loader: 'file-loader' },
      { test: /\.svg$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      { test: /\.html/, loader: 'file-loader?name=[name].[ext]' },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!less-loader' }),
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      splash: './app/splash.js',
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new BabiliPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/), // Remove other locaes to save space
    new ExtractTextPlugin('[name].css'),
    new StatsWriterPlugin({
      filename: 'stats.json', // Default
    }),
  ],
}
