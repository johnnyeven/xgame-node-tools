module.exports = function (db, data) {
	if(db) {
		db.collection('const_stations').drop();
		
		var count = 0;
		for(var i in data) {
			var content = data[i].data;
			if(content.length > 0) {
				for(var i = 1; i < content.length; i++) {
					var content_position = eval('(' + content[i][2] + ')');
					var content_services = eval('(' + content[i][5] + ')');
					var ConstStations = require('../modules/ConstStations');
					var station = new ConstStations({
						id: content[i][0],
						name: content[i][1],
						description: content[i][4],
						legion: content[i][3],
						position: {
							x: content_position[0],
							y: content_position[1],
							z: content_position[2],
							index: content_position[3]
						},
						services: content_services
					});
					count++;
					station.save(function(err, doc) {
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
		console.log('不能连接到指定MongoDB服务器');
	}
};