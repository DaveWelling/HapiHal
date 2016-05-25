(function(exports){
	var BaseRepository = require("../mongoRepositories/BaseRepository");
	var repository = new BaseRepository();
	var mongodb = require("mongodb");
	var ObjectID = mongodb.ObjectID;

	exports.createRootHNode = function createRootHNode(){
		var id = new ObjectID();
		var typeId = (ObjectID.createFromHexString("56d1dfe6365101e4003714aa"));
		var rootNode = {
			_id: id,
			title: "",
			typeId: typeId,
			createdTime: new Date().getTime(),
			modifiedTime: new Date().getTime(),
			links: []
		};
		return rootNode;
	};

	exports.fixLinkIds = function fixLinkIds(item){
		if (!item.links) return;
		for(var i=item.links.length-1; i >= 0; i--){
			item.links[i] = repository.fixStringIdInItem(item.links[i]);
		}
	};

	exports.cleanUpHNode = function cleanUpHNode(item){
		exports.fixLinkIds(item);
		if ( item.typeId && ( typeof(item.typeId) === 'string' ) ) {
			item.typeId = mongodb.ObjectID.createFromHexString(item.typeId);
		}
		delete item.type;  // remove url in case routing changes.
		if (item.links) {
			item.links.forEach(function (link) {
				if (link.href) delete link.href;
			});
		}
		return item;
	};

	exports.addHRefs = function(item){
		if (item.typeId) item.type = "/api/hNodeType/" + item.typeId;
		if (item.htmlId) item.html = "/api/viewHtml/" + item.htmlId;
		if (item.links) {
			item.links.forEach(function (link) {
				link.href = "/api/hNode/" + link._id.toHexString();
			});
		}
		return item;
	};

})(module.exports);