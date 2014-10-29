module.exports = function(callback, data) {
	var config = require('../config');
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://' + config.game_db.ip + '/' + config.game_db.database);
	var db = mongoose.connection;
	db.on('error', function() {
		callback(null, data);
	});
	db.once('open', function() {
		callback(db, data);
	});
};