const config = require('../config')
const Scanner = require('./Scanner')
const ScannerEvents = require('../Events/Scanner')

function Discover() {
  const self = this
  this.socket = require('socket.io')(config.discoverPort)

  const scanner = new Scanner()
  scanner.start()

  this.socket.on('connection', (socket) => {
    scanner.on(ScannerEvents.host, (host) => {
      socket.emit(ScannerEvents.host, host)
    })

    socket.on('disconnect', self.disconnect)
  })

  this.socket.on('error', () => {

  })

  this.disconnect = function (socket) {
    console.log('disconnect not implemented')
  }
}

new Discover()
