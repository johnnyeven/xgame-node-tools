module.exports = function(callback) {
    var config = require('../config');
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://' + config.game_db.ip + '/' + config.game_db.database);
    mongoose.connection.on('open', callback);
}