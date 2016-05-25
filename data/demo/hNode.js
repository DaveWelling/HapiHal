// TODO:  consider just putting type as profile in content type and
// removing as link.  Would need to store typeId as _id in database, and
// convert back and forth when serving to clients
// TODO: consider putting _id with links to prevent bugs/tedium of constantly
// parsing them out, or I guess create a utility method that is always used everywhere.
// Storage should not hold URLs, but only _id (to avoid conversions when URL path changes
// over versions).
// Look here (https://www.npmjs.com/package/halacious) for a HAL plugin for HAPI
var getId = require("../idUtility");
module.exports = [
	{
		bb: {
			hNodes: {
				parentIds: [],
				childrenIds: [getId("tab1"), getId("tab2")]
			}
		},
		_id: getId("primaryNavigation"),
		title: "primaryNavigation",
		typeId: getId("primaryNavigationTypeId")
	},
	{
		bb:{
			hNodes: {
				parentIds: [getId("primaryNavigation")],
				childrenIds:[getId("formlyForm")]
			}
		},
		_id: getId("tab1"),
		title: "Tab 1",
		typeId: getId("simpleLayoutTypeId")
	},
	{
		bb:{
			hNodes: {
				parentIds: [getId("tab1")],
				childrenIds:[]
			}
		},
		assetTracking:{
			assetId: [ getId("Asset1")]
		},
		_id: getId("formlyForm"),
		title: "Item Detail Entry",
		typeId: getId("formlyFormGenericTypeId")
	}
];

// Just holding these here for reference
var clientSideHNodes = [

	{
		"_links": {
			"self": {
				"href": "/api/hNode/56e5d053fe8a35e820d1445c",
				"name": "primaryNavigation",
				"profile": "/api/hNodeType/572d5aace0ce5ad0089d0d52"
			},
			"curies": [
				{
					"name": "bb",
					"href": "http://backbone.sstid.com/docs/{rel}",
					"templated": true
				}
			],
			"bb.hNode": [
				{
					"href": "api/hNode/572e0f621d123030133b9b4e",
					"name": "child",
					"title": "Tab 1"
				}, {
					"href": "api/hNode/572e0f8a1534f37833bd503a",
					"name": "child",
					"title": "Tab 2"
				}
			]
		},
		// This is not part of HAL, but would contain app info not displayed to
		// a user for this entity
		"_meta": {
			"modifiedTime" : 1462544614659,
			"createdTime" : 1457733690204,
			"_id": "56e5d053fe8a35e820d1445c"
		}
	},
	{
		"_links": {
			"self": {
				"href": "/api/hNode/572e0f621d123030133b9b4e",
				"name": "basicContainerLayout",
				"profile": "/api/hNodeType/572e015fbe111c981d60e224"
			},
			"curies": [
				{
					"name": "bb",
					"href": "http://backbone.sstid.com/docs/{rel}",
					"templated": true
				}
			],
			"bb.hNode": [
				{
					"href": "api/hNode/56d1dff77d58e7500d205ec8",
					"name": "child",
					"title": "Formly Example Form"
				},
				// Use parent node here to allow shortcut/alias type connections or
				// network rather than pure hierarchy
				{
					"href": "api/hNode/56e5d053fe8a35e820d1445c",
					"name": "parent",
					// Title is optional, it's just to give context here
					"title": "Application Primary Navigation Title"
				}
			]
		},
		// This is not part of HAL, but would contain entity info not displayed to
		// a user
		"_meta": {
			"modifiedTime" : 1462544614659,
			"createdTime" : 1457733690204,
			"_id": "572e0f621d123030133b9b4e"
		},
		"title": "Tab 1 title"
	}
];