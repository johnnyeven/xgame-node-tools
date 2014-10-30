module.exports = function(db, data) {
	if(db) {
		db.collection('const_position').drop();
		
		var count = 0;
		for(var i in data) {
			var content = data[i].data;
			if(content.length > 0) {
				for(var i = 1; i < content.length; i++) {
					var content_position = eval('(' + content[i][3] + ')');
					var content_temperature = eval('(' + content[i][6] + ')');
					var ConstPlanets = require('./modules/ConstPlanets');
					var planet = new ConstPlanets({
						id: content[i][0],
						name: content[i][1],
						description: content[i][2],
						position: {
							x: content_position[0],
							y: content_position[1],
							z: content_position[2],
							index: content_position[3]
						},
						type: content[i][4],
						diameter: content[i][5],
						temperature: {
							min: content_temperature[0],
							max: content_temperature[1]
						},
						production: {
							titanium: content[i][7],
							crystal: content[i][8],
							hydrogen: content[i][9],
							water: content[i][10],
							organics: content[i][11],
						}
					});
					count++;
					planet.save(function(err, doc) {
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
		}
		console.log('总计请求' + count);
	} else {
		console.err('不能连接到指定MongoDB服务器');
	}
};