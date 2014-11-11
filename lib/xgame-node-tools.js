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
	var types = ['station','planet','position','union','legion','species','building'];
	if(types.indexOf(type) >= 0) {
		file = process.cwd() + '/' + file;
		console.log(file);
		var xlsx = require('node-xlsx');
		var data = xlsx.parse(file);
		var mongo_connect = require('./modules/MongoConnection');
		if(type == 'station') {
			mongo_connect(require('./parsers/station_parser'), data);
		} else if(type == 'planet') {
			mongo_connect(require('./parsers/planet_parser'), data);
		} else if(type == 'position') {
			mongo_connect(require('./parsers/position_parser'), data);
		} else if(type == 'union') {
			mongo_connect(require('./parsers/union_parser'), data);
		} else if(type == 'legion') {
			mongo_connect(require('./parsers/legion_parser'), data);
		} else if(type == 'species') {
			mongo_connect(require('./parsers/species_parser'), data);
		} else if(type == 'building') {
			mongo_connect(require('./parsers/building_parser'), data);
		}
	} else {
		console.log('<type> 参数仅包含以下选项:');
		console.log('station 	空间站配置');
		console.log('planet 	星球站配置');
		console.log('position 	坐标配置');
		console.log('union 		联盟配置');
		console.log('legion 	军团配置');
		console.log('species 	种族配置');
		console.log('building 	建筑配置');
	}
}