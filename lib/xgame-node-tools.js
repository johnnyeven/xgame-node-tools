module.exports = function() {
	var program = require('commander');
	program
		.version('0.1.0')
		.command('upload <type> <file>')
		.description('上传一个 <type> 类型的服务器配置文件 <file>')
		.action(upload);

	program.parse(process.argv);
};

function upload(type, file) {
	if(type == 'station') {
		file = process.cwd() + '/' + file;
		console.log(file);
		var xlsx = require('node-xlsx');
		var data = xlsx.parse(file);

		var mongo_connect = require('./modules/MongoConnection');
		mongo_connect(upload_station, data);
	} else if(type == 'planet') {
		file = process.cwd() + '/' + file;
		console.log(file);
		var xlsx = require('node-xlsx');
		var data = xlsx.parse(file);

		var mongo_connect = require('./modules/MongoConnection');
		mongo_connect(upload_planet, data);
	} else if(type == 'position') {
		file = process.cwd() + '/' + file;
		console.log(file);
		var xlsx = require('node-xlsx');
		var data = xlsx.parse(file);

		var mongo_connect = require('./modules/MongoConnection');
		mongo_connect(require('./parsers/position_parser'), data);
	} else {
		console.log('<type> 参数仅包含以下选项:');
		console.log('station 空间站配置');
	}
}

function upload_station(db, data) {
	if(db) {
		db.collection('const_stations').drop();
		
		var count = 0;
		for(var i in data) {
			var content = data[i].data;
			if(content.length > 0) {
				for(var i = 1; i < content.length; i++) {
					var content_position = eval('(' + content[i][2] + ')');
					var content_services = eval('(' + content[i][4] + ')');
					var ConstStations = require('./modules/ConstStations');
					var station = new ConstStations({
						id: content[i][0],
						name: content[i][1],
						description: content[i][3],
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
}

function upload_planet(db, data) {
	if(db) {
		db.collection('const_planets').drop();
		
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
						},
						owner: '',
						buildings: []
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
		console.log('不能连接到指定MongoDB服务器');
	}
}