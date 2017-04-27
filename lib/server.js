const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const compression = require('compression')
const config = require('../config.js')
const cors = require('cors')

// require the page rendering logic
const renderApplication = require('../config/render.js')

// load bundle information from stats
const stats = require('../build/public/stats.json')

module.exports = function (options) {
  const publicPath = stats.publicPath || './'

  const STYLE_URL = options.separateStylesheet && (`${publicPath}main.css?${stats.hash}`)
  const SCRIPT_URL = publicPath + [].concat(stats.assetsByChunkName.main)[0]
  const COMMONS_URL = publicPath + [].concat(stats.assetsByChunkName.commons)[0]

  this.app = express()

  if (config.dev) {
    console.warn('dev mode: allow all origins (cors)')
    this.app.use(cors())
  }

  this.app.use(compression())

  this.server = http.Server(this.app)

  // Serve the static assets
  this.app.use('/_assets', express.static(path.join(__dirname, '..', 'build', 'public'), {
    // maxAge: '200d', // disable cache
  }))

  // Serve the static assets
  this.app.use('/', express.static(path.join(__dirname, '..', 'build', 'public'), {
    // maxAge: '200d', // disable cache
  }))

  // application
  this.app.get('/[people|devices]+', (req, res) => {
    renderApplication(req.path, {}, SCRIPT_URL, STYLE_URL, COMMONS_URL, (err, html) => {
      res.contentType = 'text/html; charset=utf8'
      res.end(html)
    })
  })

  // application
  this.app.get('/[^api]*', (req, res) => {
    renderApplication(req.path, {}, SCRIPT_URL, STYLE_URL, COMMONS_URL, (err, html) => {
      res.contentType = 'text/html; charset=utf8'
      res.end(html)
    })
  })

  this.app.use(bodyParser.json())

  const port = +(process.env.PORT || config.applicationPort || 8080)
  const host = (config.bindToHost || null)
  this.server.listen(port, host, () => {
    console.log(`Server listening on port ${port}`)
  })
  return this
}
