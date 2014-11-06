module.exports = function (db, data) {
	if(db) {
		db.collection('const_legion').drop();
		
		var count = 0;
		for(var i in data) {
			var content = data[i].data;
			if(content.length > 0) {
				for(var i = 1; i < content.length; i++) {
					var ConstLegion = require('../modules/ConstLegion');
					var legion = new ConstLegion({
						id: content[i][0],
						union: content[i][1],
						name: content[i][2],
						comment: content[i][3] ? content[i][3] : ''
					});
					count++;
					legion.save(function(err, doc) {
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