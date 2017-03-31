const server = require('../lib/server')

function Server(options) {
  const serverOptions = {
    prod: {
      prerender: false,
      separateStylesheet: false,
      defaultPort: options.port,
    },
    dev: {
      prerender: false,
      separateStylesheet: false,
      defaultPort: options.port,
    },
  }
  return server(serverOptions[options.serverMode])
}
module.exports = Server
