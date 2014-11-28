var config = require('../config');
var mongoose = require('mongoose');
exports.connection = mongoose.connect('mongodb://' + config.game_db.ip + '/' + config.game_db.database);