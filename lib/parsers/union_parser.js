module.exports = function (db, data) {
	if(db) {
		db.collection('const_union').drop();
		
		var count = 0;
		for(var i in data) {
			var content = data[i].data;
			if(content.length > 0) {
				for(var i = 1; i < content.length; i++) {
					var ConstUnion = require('../modules/ConstUnion');
					var union = new ConstUnion({
						id: content[i][0],
						name: content[i][1],
						comment: content[i][2] ? content[i][2] : ''
					});
					count++;
					union.save(function(err, doc) {
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