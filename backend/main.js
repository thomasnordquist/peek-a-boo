'use strict';

var config = require('../config');
var Datastore = require('nedb');
var GarbageCollector = require('./GarbageCollector');
var gravatar = require('gravatar');
var ScannerEvents = require('../Events/Scanner');
var GarbageEvents = require('../Events/GarbageCollector');
var UI = require('./Ui')({port: config.applicationPort, serverMode: 'dev'});
var _ = require('lodash');
var UIEvents = require('../Events/UIEvents');

var io = require('socket.io-client');
var events = io.connect(config.discoveryUrl);

var db = {};
db.hosts = new Datastore();
db.people = new Datastore({filename: './stores/people.db', autoload: true});

/* Set Autocompaction Interval to 1h */
db.people.persistence.setAutocompactionInterval(1000*60*60);

var garbage = {
	hosts: new GarbageCollector(db.hosts, {emit: true})
};

garbage.hosts.on(GarbageEvents.delete, function(host) {
	onHostDisappearance(host);
});

events.on(ScannerEvents.host, function(host) {
	handleHost(host);
});

function onHostDiscovery(host) {
	UI.emit(UIEvents.deviceDiscovered, UI.all(), host);
}

function onHostDisappearance(host) {
	UI.emit(UIEvents.deviceDisappeared, UI.all(), host);
}

function onPersonUpdate(person) {
	UI.emit(UIEvents.personUpdateNotification, UI.all(), person);
}

function onDeviceUpdate(person) {
	UI.emit(UIEvents.deviceUpdateNotification, UI.all(), person);
}

function onPersonDisappearance(host) {
	UI.emit(UIEvents.personDisappeared, UI.all(), host);
}

function createPerson(target, person) {
	db.people.findOne( {email: person.email}, function(err, result) {
		if(result == null) {
			person.gravatar = gravatar.url(person.email, {s: '200', r: 'pg', d: 'retro'});
			db.people.insert(person);

			UI.emit(UIEvents.people, target, [person]);
			UI.emit(UIEvents.addPersonNotification, UI.all(), person);
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

function getDevices(target) {
	db.hosts.find({}, function(err, result) {
		if(null == err) {
			UI.emit(UIEvents.devices, target, result);
		} else {
			console.log('Error: ', err);
		}
	});
};

function setOwnerOfDevice(target, email, mac) {
	function updateDevice(mac, person){

		db.hosts.update({mac: mac}, {$set:{owner: person}}, {}, function(err, num){
			console.log('Update: ', num);
			db.hosts.findOne({mac: mac}, function(err, dev) {
				dev ? onDeviceUpdate(dev) : false;
			})
		});
	}
	function setNewOwner(email, mac){
		if(!email || email == '' ){
			updateDevice(mac, null);
			return;
		}

		db.people.findOne({email: email}, function(err, person) {
			if(null != person) {
				if(!person.devices) {
					person.devices = [];
				}
				person.devices.push({mac: mac});
				db.people.update({email: email}, person);
				onPersonUpdate(person);
			}
			updateDevice(mac, person);
		});
	}

	db.people.findOne({"devices.mac": mac}, function(err, person) {
		if(person) {
			person.devices = person.devices.filter(function(dev) {
				return dev.mac != mac;
			});

			db.people.update({email: person.email}, {$set:{devices: person.devices}}, function(err, replaced){
				setNewOwner(email, mac);
			});
		} else {
			setNewOwner(email, mac);
		}
	});


};

function handleHost(host) {
	db.hosts.findOne({mac: host.mac}, function(err, entry) {
		db.people.findOne( { "devices.mac": host.mac }, function(err, person) {
			if(person) {
				host.owner = person;
				person.lastSeen = host.lastSeen;

				db.people.update({email: person.email}, { $set: { lastSeen: host.lastSeen } });
				onPersonUpdate(person);
			}
			if(entry) {
				host = _.merge(entry, host);
				db.hosts.update({mac: host.mac}, host);
			} else {
				db.hosts.insert(host);
			}
			onHostDiscovery(host);
		});
	}.bind(this));
};

UI.on(UIEvents.createPerson, createPerson);
UI.on(UIEvents.getPersons, getPersons);
UI.on(UIEvents.getDevices, getDevices);
UI.on(UIEvents.setOwnerOfDevice, setOwnerOfDevice);

//scanner.start();
