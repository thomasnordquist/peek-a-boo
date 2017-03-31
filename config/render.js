const fs = require('fs')
const path = require('path')

const html = fs.readFileSync(path.resolve(__dirname, '../app/index.html'), 'utf-8')

module.exports = function render(dir, readItems, scriptUrl, styleUrl, commonsUrl, callback) {
  callback(null, html.replace('SCRIPT_URL', scriptUrl))
}
