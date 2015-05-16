var _ = require('lodash');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var ScannerEvents = require('../Events/Scanner');
var libnmap = require('node-libnmap');
var arp = require('node-arp');
var moment = require('moment');
var config = require('../config.js');

var opts = {
	nmap: config.nmapBinary,
	range: ['192.168.178.1-255'],
	ports: [ '80', 22 ]
};

function Scanner() {
	var self = this;

	EventEmitter.call(this);

	var discoverInterval = config.discoverInterval*1000;
	var discoverTimeout = null;

	function discover() {
		libnmap.nmap('scan', _.clone(opts), function(err, report){
			report.forEach(function(result){
				result = result[0];
				handleNmapResult(result);
			});
			discoverTimeout = setTimeout(discover, discoverInterval);
		})
	}

	function handleNmapResult(result) {
		function reportHost(mac) {
			var info = {
				mac: mac, 
				host: result.hostname, 
				ip:result.ip, 
				lastSeen: parseInt(moment().format('x'))
			};
			self.emit(ScannerEvents.host, info)
		}
		fetchMac(result, reportHost);
	}

	function fetchMac(nmapResult, callback) {
		arp.getMAC(nmapResult.ip, function(err, mac) {
			if (!err) {
				callback(mac)				
			}
		});
	}

	this.stop = function() {
		clearTimeout(discoverTimeout);
	};

	this.start = function() {
		discover();
	};
}

util.inherits(Scanner, EventEmitter);

module.exports = Scanner;
