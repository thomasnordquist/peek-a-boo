var Datastore = require('nedb');

db = {};
db.hosts = new Datastore({filename: '../stores/hosts.db', autoload: true});
db.people = new Datastore({filename: '../stores/people.db', autoload: true});

function showHosts() {
	db.people.find( {}, function(err, info) {
		console.log('Hosts: ', info);
	});
}

function getPerson(mac) {
	db.people.find( { "devices.mac" : mac }, function(err, info) {
		console.log('Person: ', err, info);
	});
}
//showHosts();
showHosts();
//getPerson("80:e6:50:23:fe:62");
