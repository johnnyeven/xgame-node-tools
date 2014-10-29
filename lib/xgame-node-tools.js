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
		var xlsx = require('node-xlsx');
		var data = xlsx.parse(file);

		var mongo_connect = require('./modules/MongoConnection');
		mongo_connect(function(db) {
			if(db) {
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
				console.err('不能连接到指定MongoDB服务器');
			}
		});
	} else {
		console.log('<type> 参数仅包含以下选项:');
		console.log('station 空间站配置');
	}
}