var Datastore = require('nedb');

db = {};
db.hosts = new Datastore({filename: './hosts.db', autoload: true});
db.people = new Datastore({filename: './people.db', autoload: true});

function showHosts() {
	db.hosts.find( {}, function(err, info) {
		console.log('Hosts: ', info);
	});
}

showHosts();
