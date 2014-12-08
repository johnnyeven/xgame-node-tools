module.exports = function (data) {
	var mongoose = require('mongoose');
	if(mongoose.connections && mongoose.connections.length > 0) {
		var db = mongoose.connections[0].db;
		if(db) {
			db.collection('const_buildings').drop();
			var count = 0;
			for(var i in data) {
				var id = data[i].name;
				var number = parseInt(id.match(/\d+/)[0]);
				var content = data[i].data;
				if(content.length > 0) {
					var levels = [];
					for(var i = 1; i < content.length; i++) {
						if(number < 2000) {
							var level = {
								level: content[i][0],
								upgrade_time: content[i][3],
								requires: {
									titanium: content[i][4],
									crystal: content[i][5],
									hydrogen: content[i][6],
									water: content[i][7],
									organics: content[i][8],
									power: content[i][9]
								},
								production: {
									titanium: content[i][10],
									crystal: content[i][11],
									hydrogen: content[i][12],
									water: content[i][13],
									organics: content[i][14],
									power: content[i][15]
								}
							};
						} else {
							var level = {
								level: content[i][0],
								upgrade_time: content[i][3],
								requires: {
									titanium: content[i][4],
									crystal: content[i][5],
									hydrogen: content[i][6],
									water: content[i][7],
									organics: content[i][8],
									power: content[i][9]
								}
							};
						}
						levels.push(level);
					}
					var ConstBuildings = require('../modules/ConstBuildings');
					var building = new ConstBuildings({
						id: id,
						name: content[1][1],
						comment: content[1][2] ? content[1][2] : '',
						levels: levels
					});
					count++;
					building.save(function(err, doc) {
						if(!err && doc) {
							count--;
							console.log(doc.id + " 保存成功(" + count + ")");
							if(count <= 0) {
								db.close();
							}
						}
					});
				}
			}
			console.log('总计请求' + count);
		} else {
			console.log('没有连接到指定MongoDB服务器');
		}
	} else {
		console.log('不能连接到指定MongoDB服务器');
	}
};