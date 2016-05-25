describe("Integration Mongo userRootRepository", function() {
	var repository = require("../../../src/mongoRepositories/index").userRoot;
	var cuid = require('cuid');
	var cleanUpQueue = [];
	var chai = require("chai");
	var ObjectID = require('mongodb').ObjectID;
	before(function () {
		chai.should();
	});
	afterEach(function () {
		cleanUpQueue.forEach(function (rootId) {
			repository.remove(rootId);
		});
	});
	describe("get", function(){
		it("should return a userRoot for a userName", function (done) {
			var userName = cuid();
			var rootId = new ObjectID();
			repository.insert({_id: rootId, userName: userName}).then(function () {
				cleanUpQueue.push(rootId);
				return repository.getByUserName(userName).then(function (userRoot) {
					userRoot._id.toHexString().should.equal(rootId.toHexString());
					done();
				})
			}).catch(function(error){
				done(error);
			});
		});
	});
});