(function(results){

	var repositories = require("../mongoRepositories");
	var modelHelpers = require("./modelHelpers");
	var q = require("q");
	const Boom = require('boom');

	var returnTypes = {
		generalError: 500,
		requestDataBad: 400,
		requestSuccess: 200,
		newItemCreated: 201,
		itemNotFound: 404
	};

	function validateInsert(item) {

		var error;
		if (!item._id) error = Boom.badRequest("An _id is required.");
		if (!item.typeId) error = Boom.badRequest("A typeId is required.");
		if (error){
			var defer = q.defer();
			defer.reject(error);
			return defer.promise;
		}
		return repositories.hNode.get(item._id).then(function(found){
			if (found) {
				throw Boom.badRequest("Duplicate hNode id");
			}
		});
	}


	results.insert = function(item){
		repository = repositories.hNode;
		return validateInsert(item).then(function(){
			item = modelHelpers.cleanUpHNode(item);
			return repository.insert(item).then(function (itemResult) {
				return { status: returnTypes.newItemCreated, item: itemResult };
			});
		});
	};

	results.update = function(item){
		modelHelpers.cleanUpHNode(item);
		return repositories.hNode.update(item).then(function (itemResult) {
			return { status: returnTypes.requestSuccess, item: itemResult };
		});
	};

	results.get = function(id) {
		return repositories.hNode.get(id).then(function (item) {
			if (!item) throw Boom.notFound();
			item = modelHelpers.addHRefs(item);
			return item;
		});
	};

})(module.exports);