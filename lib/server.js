module.exports = function(options) {
	var http = require('http');
	var express = require('express');
	var bodyParser = require('body-parser');
	var path = require('path');
	var fs = require('fs');
	var compression = require('compression');
	var config = require('../config.js');

	// require the page rendering logic
	var renderApplication = require('../config/render.js');

	// load bundle information from stats
	var stats = require('../build/stats.json');

	var publicPath = stats.publicPath;

	var STYLE_URL = options.separateStylesheet && (publicPath + 'main.css?' + stats.hash);
	var SCRIPT_URL = publicPath + [].concat(stats.assetsByChunkName.main)[0];
	var COMMONS_URL = publicPath + [].concat(stats.assetsByChunkName.commons)[0];

	this.app = express();
	this.app.use(compression());
	this.server = http.Server(app);

	// serve the static assets
	this.app.use('/_assets', express.static(path.join(__dirname, '..', 'build', 'public'), {
		maxAge: '200d' // We can cache them as they include hashes
	}));
	this.app.use('/', express.static(path.join(__dirname, '..', 'public'), {
	}));

	this.app.use(bodyParser.json());

	// application
	this.app.get('/*', function(req, res) {
		renderApplication(req.path, {}, SCRIPT_URL, STYLE_URL, COMMONS_URL, function(err, html) {
			res.contentType = 'text/html; charset=utf8';
			res.end(html);
		});
	});

	var port = +(process.env.PORT || options.defaultPort || 8080);
	var host = (config.bindToHost || null)
	this.server.listen(port, host, function() {
		console.log('Server listening on port ' + port);
	});
	return this;
};
