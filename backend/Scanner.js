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
	range: ['192.168.178.1-255']
};

function Scanner() {
	var self = this;

	EventEmitter.call(this);

	var discoverInterval = config.discoverInterval*1000;
	var discoverTimeout = null;

	function discover() {
		libnmap.nmap('discover', _.clone(opts), function(err, report){
			if(err) {console.log('Error', err);}
			//console.log(report);
			report[0].neighbors.forEach(function(result){
				//result = result[0];
				console.log('Found: ', result);
				handleNmapResult(result);
			});
			discoverTimeout = setTimeout(discover, discoverInterval);
		})
	}

	function handleNmapResult(result) {
		function reportHost(mac) {
			var info = {
				mac: mac,
				host: result,
				lastSeen: parseInt(moment().format('x'))
			};
			console.log('Resolved: ', result, mac);
			self.emit(ScannerEvents.host, info)
		}
		var time = Math.round(Math.random()*2);
		setTimeout(fetchMac, time, result, reportHost);
	}

	function fetchMac(host, callback) {
		arp.getMAC(host, function(err, mac) {
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
