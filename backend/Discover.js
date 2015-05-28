var config = require('../config');
var Scanner = require('./Scanner');
var ScannerEvents = require('../Events/Scanner');

function Discover() {
    var self = this;
    this.socket = require('socket.io')(config.discoverPort);

    var scanner = new Scanner();
    scanner.start();

    this.socket.on('connection', function (socket) {
        scanner.on(ScannerEvents.host, function(host) {
            socket.emit(ScannerEvents.host, host);
        });

        socket.on('disconnect', self.disconnect);
    });

    this.socket.on('error', function () {

    });

    this.disconnect = function (socket) {
        console.log('disconnect not implemented');
    };
}

new Discover();