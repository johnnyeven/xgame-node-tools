module.exports = function(db, data) {
	if(db) {
		var continue2 = function() {
			console.log('读取星系');
			db.collection('const_position3').drop();
			var count = 0;
			var content = data[2].data;
			if(content.length > 0) {
				for(var i = 1; i < content.length; i++) {
					var ConstPosition3 = require('../modules/ConstPosition3');
					var position = new ConstPosition3({
						id: content[i][0],
						parent: content[i][1],
						name: content[i][2]
					});
					count++;
					position.save(function(err, doc) {
						if(!err && doc) {
							count--;
							console.log(doc.id + " 保存成功(" + count + ")");
							if(count <= 0) {
								db.close();
							}
						} else {
							console.log(err);
						}
					});
				}
			}
			console.log('总计请求' + count);
		};
		var continue1 = function() {
			console.log('读取星座');
			db.collection('const_position2').drop();
			var count = 0;
			var content = data[1].data;
			if(content.length > 0) {
				for(var i = 1; i < content.length; i++) {
					var ConstPosition2 = require('../modules/ConstPosition2');
					var position = new ConstPosition2({
						id: content[i][0],
						parent: content[i][1],
						name: content[i][2]
					});
					count++;
					position.save(function(err, doc) {
						if(!err && doc) {
							count--;
							console.log(doc.id + " 保存成功(" + count + ")");
							if(count <= 0) {
								continue2();
							}
						} else {
							console.log(err);
						}
					});
				}
			}
			console.log('总计请求' + count);
		};

		console.log('读取星域');
		db.collection('const_position1').drop();
		var count = 0;
		var content = data[0].data;
		if(content.length > 0) {
			for(var i = 1; i < content.length; i++) {
				var ConstPosition1 = require('../modules/ConstPosition1');
				var position = new ConstPosition1({
					id: content[i][0],
					name: content[i][1]
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