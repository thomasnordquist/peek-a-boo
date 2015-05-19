var config = require('../config');
var moment = require('moment');
var GarbageEvents = require('../Events/GarbageCollector');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function GarbageCollector(db, options) {
	EventEmitter.call(this);
	var self = this;

	function collect() {
		console.log('Running GarbageCollector');
		var threshold = moment().format('x') - (config.offlineAfter * 1000);
		db.find({'lastSeen': { $lt: threshold }}, function(err, items) {
			if(err) {
				console.log(err);
			}

			items.forEach(function(item) {
				console.log('Delete: ', item);
				if(options.emit) {
					self.emit(GarbageEvents.delete, item)
				}
				db.remove({mac: item.mac});
			});
		});
		setTimeout(collect, config.offlineAfter*1000/4); /* 4 x frequency */
	}
	collect();
};
util.inherits(GarbageCollector, EventEmitter);

module.exports = GarbageCollector;

