(function (utilities) {
	var ObjectID = require('mongodb').ObjectID;
	utilities.getTestClientHNode = getTestHalHNode;
	utilities.getTestDatabaseHNode = getTestDatabaseHNode;
	
	function getTestDatabaseHNode(title){
		var id = (new ObjectID()).toHexString();
		var typeId = (new ObjectID()).toHexString();
		var childId1 = (new ObjectID()).toHexString();
		var childId2 = (new ObjectID()).toHexString();
		return {
			"bb": {
				"hNodes": {
					"parentIds": [],
					"childrenIds": [childId1, childId2]
				}
			},
			"_id": id,
			"title": title || ("test" + id),
			"typeId": typeId,
			"modifiedTime" : new Date().getTime(),
			"createdTime" : new Date().getTime()
		};
	}
	
	function getTestHalHNode (title){
		var idString = (new ObjectID()).toHexString();
		var typeId = (new ObjectID()).toHexString();
		var childId1 = (new ObjectID()).toHexString();
		var childId2 = (new ObjectID()).toHexString();
		return {
			"_links": {
				"self": {
					"href": "/api/hNode/" + idString,
					"profile": "/api/hNodeType/" + typeId
				},
				"curies": [
					{
						"name": "bb",
						"href": "/documentation/{rel}",
						"templated": true
					}
				],
				"bb.hNode": [
					{
						"href": "/api/hNode/" + childId1,
						"name": "child"
					}, {
						"href": "/api/hNode/" + childId2,
						"name": "child"
					}
				]
			},
			// This is not part of HAL, but would contain app info not displayed to
			// a user for this entity
			"_meta": {
				"modifiedTime" : new Date().getTime(),
				"createdTime" : new Date().getTime(),
				"_id": idString
			},
			"title": title || ("test" + idString)
		}

	}
})(module.exports);