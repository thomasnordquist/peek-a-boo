const webpack = require('webpack')
const path = require('path')
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin

module.exports = {
  context: `${__dirname}/app`,
  entry: { app: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:3000',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    './Router?main',
  ] },
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
      {
        test: /.png|.svg?$/,
        loader: 'file-loader',
        exclude: /node_modules/,
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
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'less-loader',
          options: {
            paths: [
              path.resolve(__dirname, 'node_modules'),
            ] },
        }],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new StatsWriterPlugin({
      filename: 'stats.json', // Default
    }),
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin(),
    // do not emit compiled assets that include errors
  ],
  devServer: {
    host: 'localhost',
    port: 3000,

    historyApiFallback: true,
  // respond to 404s with index.html

    hot: true,
  // enable HMR on the server
  },
}
