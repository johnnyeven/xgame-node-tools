module.exports = function (db, data) {
	if(db) {
		db.collection('const_species').drop();
		
		var count = 0;
		for(var i in data) {
			var content = data[i].data;
			if(content.length > 0) {
				for(var i = 1; i < content.length; i++) {
					var ConstSpecies = require('../modules/ConstSpecies');
					var species = new ConstSpecies({
						id: content[i][0],
						name: content[i][1],
						comment: content[i][2],
						born_place: content[i][3],
						born_legion: content[i][4]
					});
					count++;
					species.save(function(err, doc) {
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