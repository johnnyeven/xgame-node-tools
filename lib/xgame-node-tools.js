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
		for(var i in data) {
			var content = data[i].data;
			if(content.length > 0) {
				for(var i = 1; i < content.length; i++) {
					console.log(content[i]);
				}
			}
		}
	} else {
		console.log('<type> 参数仅包含以下选项:');
		console.log('station 空间站配置');
	}
}