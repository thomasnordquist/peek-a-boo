const path = require('path')
const webpack = require('webpack')
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
const loadersByExtension = require('../loadersByExtension')

module.exports = function (options) {
  const entry = {
    main: reactEntry('main'),
		// second: reactEntry("second")
  }
  const loaders = {
    coffee: 'coffee-redux-loader',
    jsx: options.hotComponents ? ['react-hot-loader', 'jsx-loader?harmony'] : 'jsx-loader?harmony',
    js: 'jsx-loader?harmony',
    json: 'json-loader',
		// "js": {
			// loader: "6to5-loader",
			// include: path.join(__dirname, "app")
		// },
    json5: 'json5-loader',
    txt: 'raw-loader',
    'png|jpg|jpeg|gif|svg': 'url-loader?limit=10000',
    'woff|woff2': 'url-loader?limit=100000',
    'ttf|eot': 'file-loader',
    'wav|mp3': 'file-loader',
    html: 'html-loader',
    'md|markdown': ['html-loader', 'markdown-loader'],
    'bootstrap/js/': 'imports?jQuery=jquery',
  }
  const stylesheetLoaders = {
    css: 'css-loader',
    less: 'css-loader!less-loader',
    styl: 'css-loader!stylus-loader',
    'scss|sass': 'css-loader!sass-loader',
  }
  const additionalLoaders = [
		// { test: /some-reg-exp$/, loader: "any-loader" }
  ]
  const alias = {

  }
  const aliasLoader = {

  }
  const externals = [

  ]
  const modulesDirectories = ['web_modules', 'node_modules']
  const extensions = ['', '.web.js', '.js', '.jsx']
  const basePath = path.join(__dirname, '..', '..')
  const root = path.join(basePath, 'app')
  const publicPath = options.devServer ?
		'http://localhost:2992/_assets/' :
		'/_assets/'
  const output = {
    path: path.join(basePath, 'build', options.prerender ? 'prerender' : 'public'),
    publicPath,
    filename: `[name].js${options.longTermCaching && !options.prerender ? '?[chunkhash]' : ''}`,
    chunkFilename: (options.devServer ? '[id].js' : '[name].js') + (options.longTermCaching && !options.prerender ? '?[chunkhash]' : ''),
    sourceMapFilename: 'debugging/[file].map',
    libraryTarget: options.prerender ? 'commonjs2' : undefined,
    pathinfo: options.debug,
  }
  const excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/,
    /node_modules[\\\/]items-store[\\\/]/,
  ]
  const plugins = [
    function () {
      if (!options.prerender) {
        this.plugin('done', (stats) => {
          const jsonStats = stats.toJson({
            chunkModules: true,
            exclude: excludeFromStats,
          })
          jsonStats.publicPath = publicPath
          require('fs').writeFileSync(path.resolve(path.join(basePath, 'build', 'stats.json')), JSON.stringify(jsonStats))
        })
      }
    },
    new webpack.PrefetchPlugin('react'),
    new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ]
  if (options.prerender) {
    aliasLoader['react-proxy$'] = 'react-proxy/unavailable'
    externals.push(
			/^react(\/.*)?$/,
			/^reflux(\/.*)?$/,
			'superagent',
			'async',
		)
    plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }))
  }
  if (options.commonsChunk) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin('commons', `commons.js${options.longTermCaching && !options.prerender ? '?[chunkhash]' : ''}`))
  }


  function reactEntry(name) {
    return `./app/Router?${name}`
  }
  Object.keys(stylesheetLoaders).forEach((ext) => {
    let loaders = stylesheetLoaders[ext]
    if (Array.isArray(loaders)) loaders = loaders.join('!')
    if (options.prerender) {
      stylesheetLoaders[ext] = 'null-loader'
		// } else if(options.separateStylesheet) {
		//	stylesheetLoaders[ext] = ExtractTextPlugin.extract("style-loader", loaders);
    } else {
      stylesheetLoaders[ext] = `style-loader!${loaders}`
    }
  })
	/* if(options.separateStylesheet && !options.prerender) {
		plugins.push(new ExtractTextPlugin("[name].css" + (options.longTermCaching ? "?[contenthash]" : "")));
	}*/
  if (options.minimize) {
    plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.optimize.DedupePlugin(),
			new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
}),
			new webpack.NoErrorsPlugin(),
		)
  }

  return {
    entry,
    output,
    target: options.prerender ? 'node' : 'web',
    module: {
      loaders: loadersByExtension(loaders).concat(loadersByExtension(stylesheetLoaders)),
    },
    devtool: options.devtool,
		// debug: options.debug,
    resolveLoader: {
      root: path.join(basePath, 'node_modules'),
      alias: aliasLoader,
    },
    externals,
    resolve: {
      root,
      modulesDirectories,
      extensions,
      alias,
    },
    plugins,
    devServer: {
      stats: {
        cached: false,
        exclude: excludeFromStats,
      },
    },
  }
}
