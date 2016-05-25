var getId = require("../idUtility");
module.exports = [
	{
		_id : getId("primaryNavigationTypeId"),
		title: "Primary Navigation"
	},
	{
		_id : getId("simpleLayoutTypeId"),
		title: "Simple Layout"
	},
	{
		_id : getId("formlyFormGenericTypeId"),
		title: "Generic Formly Form"
	}
];

// Hold this here for reference
var halVersion = [
	{
		"_links": {
			"self": {
				"href": "/api/hNodeType/xxxxxxxxxxx",
				"title": "Asset"
			}
		},
		"fields": {
			"AssetID": {
				"type": "shortText",
				"label": "Asset ID",
				"profile": "api/hNodeType/xxxxxx",
				"sequence": 0
			},
			"description": {
				"type": "longText",
				"label": "Description",
				"profile": "api/hNodeType/xxxxxx",
				"sequence": 1
			}
		},
		// Not sure yet how to attach these up
		"validators": "formlyAssetValidators()"
	},
	{
		"_links": {
			"self": {
				"href": "api/hNodeType/xxxxxxx",
				"title": "shortText"
			}
		},
		// Not sure yet how to attach these up
		"validators": "formlyShortTextValidators()"
	},
	{
		"_links": {
			"self": {
				"href": "api/hNodeType/xxxxxxx",
				"title": "longText"
			}
		},
		// Not sure yet how to attach these up
		"validators": "formlyLongTextValidators()"
	}
];