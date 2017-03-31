module.exports = [
	require("./make-webpack-config")({
		// commonsChunk: true,
		longTermCaching: true,
		separateStylesheet: false,
		minimize: true,
		//devtool: "source-map"
	}),
	/*require("./make-webpack-config")({
		prerender: true
	})*/
];