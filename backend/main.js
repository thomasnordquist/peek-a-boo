'use strict';

var Datastore = require('nedb');
var GarbageCollector = require('./GarbageCollector');
var gravatar = require('gravatar');
var Scanner = require('./Scanner');
var ScannerEvents = require('../Events/Scanner');
var GarbageEvents = require('../Events/GarbageCollector');
var UI = require('./Ui')({port: 8080, serverMode: 'dev'});
var _ = require('lodash');
var UIEvents = require('../Events/UIEvents');

var db = {};
db.hosts = new Datastore({filename: './stores/hosts.db', autoload: true});
db.people = new Datastore({filename: './stores/people.db', autoload: true});

var garbage = {
	hosts: new GarbageCollector(db.hosts, {emit: true}),
	people: new GarbageCollector(db.people)
};

function createPerson(target, person) {
	db.people.findOne( {email: person.email}, function(err, result) {
		if(result == null) {
			person.gravatar = gravatar.url(person.email, {s: '200', r: 'pg', d: 'retro'});
			db.people.insert(person);
			UI.emit(UIEvents.people, target, [person]);
		}
	});
};

function getPersons(target) {
	db.people.find( {}, function(err, result) {
		if(null == err) {
			UI.emit(UIEvents.persons, target, result);
		} else {
			console.log('Error: ', err);
		}
	});
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

UI.on(UIEvents.createPerson, createPerson);
UI.on(UIEvents.getPersons, getPersons);

function onHostDiscovery(host) {
	UI.emit(UIEvents.hostDiscovered, UI.all(), host);
}

function onHostDisappearance(host) {
	UI.emit(UIEvents.hostDisappeared, UI.all(), host);
}

function onPersonDiscovery(host) {
	UI.emit(UIEvents.personDiscovered, UI.all(), host);
}

function onPersonDisappearance(host) {
	UI.emit(UIEvents.personDisappeared, UI.all(), host);
}

scanner.start();
