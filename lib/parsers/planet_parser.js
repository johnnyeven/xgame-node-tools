module.exports = function (data) {
	var mongoose = require('mongoose');
	if(mongoose.connections && mongoose.connections.length > 0) {
		var db = mongoose.connections[0].db;
		if (db) {
			db.collection('planets').drop();

			var count = 0;
			for (var i in data) {
				var content = data[i].data;
				if (content.length > 0) {
					for (var i = 1; i < content.length; i++) {
						var content_position = eval('(' + content[i][3] + ')');
						var content_temperature = eval('(' + content[i][8] + ')');
						var content_buildings_limit = eval('(' + content[i][19] + ')');
						var Planets = require('../modules/Planets');
						var planet = new Planets({
							id: content[i][0],
							name: content[i][1],
							description: content[i][2],
							position: {
								x: content_position[0],
								y: content_position[1],
								z: content_position[2],
								index: content_position[3]
							},
							is_npc_legion: parseInt(content[i][4]) > 0 ? true : false,
							legion: content[i][5],
							type: content[i][6],
							diameter: content[i][7],
							temperature: {
								min: content_temperature[0],
								max: content_temperature[1]
							},
							production: {
								titanium: content[i][9],
								crystal: content[i][10],
								hydrogen: content[i][11],
								water: content[i][12],
								organics: content[i][13]
							},
							resources: {							//资源持有量
								titanium: content[i][14],			//钛合金
								crystal: content[i][15],			//晶体
								hydrogen: content[i][16],			//氚氢气
								water: content[i][17],				//水
								organics: content[i][18]			//有机物
							},
							production_rate: {			//资源每小时产量
								titanium: 0,			//钛合金
								crystal: 0,				//晶体
								hydrogen: 0,			//氚氢气
								water: 0,				//水
								organics: 0				//有机物
							},
							last_updated: 0,
							owner: '',
							buildings_limit: content_buildings_limit,
							buildings: []
						});
						count++;
						planet.save(function (err, doc) {
							if (!err && doc) {
								count--;
								console.log(doc.id + " 保存成功(" + count + ")");
								if (count <= 0) {
									db.close();
								}
							} else {
								console.log(err);
							}
						});
					}
				}
			}
			console.log('总计请求' + count);
		} else {
			console.log('不能连接到指定MongoDB服务器');
		}
	} else {
		console.log('不能连接到指定MongoDB服务器');
	}
};