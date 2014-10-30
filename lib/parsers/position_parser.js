module.exports = function(db, data) {
	if(db) {
		var continue2 = function() {
			var content = data[2].data;
			if(content.length > 0) {
				var result = {};
				for(var i = 1; i < content.length; i++) {
					var item = {
						id: content[i][0],
						name: content[i][3]
					};
					if(!result[content[i][2]]) {
						result[content[i][2]] = {};
					}
					if(!result[content[i][2]][content[i][1]]) {
						result[content[i][2]][content[i][1]] = [];
					}
					result[content[i][2]][content[i][1]].push(item);
				}
				var count = 0;
				for(var m in result) {
					for(var n in result[m]) {
						count++;
						ConstPosition.update({
							id: parseInt(m),
							"y.id": parseInt(n)
						}, {
							"y.$.z": result[m][n]
						}, function(err, numberAffected, raw) {
							count--;
							if(count <= 0) {
								db.close();
							}
						});
					}
				}
			}
		};
		var continue1 = function() {
			var content = data[1].data;
			if(content.length > 0) {
				var result = {};
				for(var i = 1; i < content.length; i++) {
					var item = {
						id: content[i][0],
						name: content[i][2],
						z: []
					};
					if(!result[content[i][1]]) {
						result[content[i][1]] = [];
					}
					result[content[i][1]].push(item);
				}
				var ConstPosition = require('../modules/ConstPosition');
				for(var j in result) {
					ConstPosition.update({
						id: parseInt(j)
					}, {
						y: result[j]
					}, function(err, numberAffected, raw) {
						continue2();
					});
				}
			}
		};

		db.collection('const_position').drop();
		
		var count = 0;
		var content = data[0].data;
		if(content.length > 0) {
			for(var i = 1; i < content.length; i++) {
				var ConstPosition = require('../modules/ConstPosition');
				var position = new ConstPosition({
					id: content[i][0],
					name: content[i][1],
					y: []
				});
				count++;
				position.save(function(err, doc) {
					if(!err && doc) {
						count--;
						console.log(doc.id + " 保存成功(" + count + ")");
						if(count <= 0) {
							continue1();
						}
					} else {
						console.log(err);
					}
				});
			}
		}
		console.log('总计请求' + count);
	} else {
		console.err('不能连接到指定MongoDB服务器');
	}
};