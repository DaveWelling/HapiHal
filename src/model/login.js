(function(results){

	var repositories = require("../mongoRepositories");
	var modelHelpers = require("./modelHelpers");
	var q = require("q");

	var returnTypes = {
		generalError: 500,
		requestDataBad: 400,
		requestSuccess: 200,
		newItemCreated: 201,
		itemNotFound: 404
	};

	results.createNewUserRoot = function(userName){
		var hNode = modelHelpers.createRootHNode();
		return q.all([repositories.userRoot.insert({"_id": hNode._id, "userName": userName})
		, repositories.hNode.insert(hNode)])
		.then(function(result){
			return result[0];
		});
	};

})(module.exports);