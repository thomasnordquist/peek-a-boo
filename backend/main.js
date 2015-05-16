'use strict';

var Datastore = require('nedb');
var GarbageCollector = require('./GarbageCollector');

var Scanner = require('./Scanner');
var ScannerEvents = require('../Events/Scanner');
var GarbageEvents = require('../Events/GarbageCollector');
var UI = require('./Ui')({port: 8080, serverMode: 'dev'});
var _ = require('lodash');
var UIEvents = require('../Events/UIEvents');

function onHostDiscovery(host) {
	UI.emit(UIEvents.hostDiscovered, UI.all(), host);
}

function onHostDisappearance(host) {
	UI.emit(UIEvents.hostDisappeared, UI.all(), host);
}

var db = {};
db.hosts = new Datastore({filename: './hosts.db', autoload: true});
db.people = new Datastore({filename: './people.db', autoload: true});

var garbage = {
	hosts: new GarbageCollector(db.hosts, {emit: true}),
	people: new GarbageCollector(db.people)
};

function handleHost(host) {
	console.log('Handle:', host.mac);
	db.hosts.findOne({mac: host.mac}, function(err, entry) {
		if(entry) {
			host = _.merge(entry, host);
			console.log('Update:', host);
			db.hosts.update({mac: host.mac}, host);	
		} else {
			console.log('Insert:', host);
			db.hosts.insert(host);	
		}
		onHostDiscovery(host);
	}.bind(this));
};

var scanner = new Scanner();

scanner.on(ScannerEvents.host, function(host) {
	handleHost(host);
});

garbage.hosts.on(GarbageEvents.delete, function(host) {
	onHostDisappearance(host);
});

scanner.start();
