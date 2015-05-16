function Server(options) {
    var serverOptions = {
        prod: {
            prerender: false,
            separateStylesheet: false,
            defaultPort: options.port
        },
        dev: {
            prerender: false,
            separateStylesheet: false,
            defaultPort: options.port
        }
    };
    return require("../lib/server")(serverOptions[options.serverMode]);
}
module.exports = Server;