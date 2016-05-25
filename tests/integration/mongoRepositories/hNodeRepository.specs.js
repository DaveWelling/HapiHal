describe("Integration Mongo hNodeRepository", function(){
    var repository = require("../../../src/mongoRepositories/index").hNode;
    var cuid = require('cuid');
    var cleanUpQueue = [];
    var chai = require("chai");
	var utilities = require("../../hNodeUtilities");
    before(function(){
        chai.should();
    });
    afterEach(function(){
        cleanUpQueue.forEach(function(testHNode){
            repository.remove(testHNode._id);
        });
    });

    describe("getByTitle", function(){
        it("should get a hNode with the given title if one exists", function(done){
            var title = cuid();
			var testNode = utilities.getTestHNodeWithTitle(title);
			repository.insert(testNode).then(function (hNode) {
				var holdHNode = hNode;
				cleanUpQueue.push(holdHNode);
				return repository.getByTitle(title).then(function (foundHNode) {
					foundHNode._id.toHexString().should.equal(holdHNode._id.toHexString());
					done();
				})
			}).catch(function(error){
				done(error);
			});
        });
    });
    describe("get", function(){

        it("should get a hNode for a passed id", function(done){
            repository.insert(utilities.getTestHNode()).then(function(hNode){
				var holdHNode = hNode;
				cleanUpQueue.push(holdHNode);
				return repository.get(holdHNode._id).then(function(foundHNode){
					foundHNode._id.toHexString().should.equal(holdHNode._id.toHexString());
					done();
				});
			}).catch(function(error){
				done(error);
			});
        });
        it("should throw an error if an id is not passed", function(){
            repository.get(null).then(
                function(foundHNode){
                }, function(err){
                    return expect(err.message).to.eventually.be("An id is required for a get operation.");
                }
            );
        });
    });

    describe("Update", function(){
        it("should change the stored value of a hNode", function(done){
            var newTitle = "Altered test hNode";
            var testHNode = utilities.getTestHNode();
			var idString = testHNode._id;
            repository.insert(testHNode).then(function(){
				testHNode.title = newTitle;
				cleanUpQueue.push(testHNode);
				return repository.update(testHNode);
			}).then(function(){
				return repository.get(testHNode._id);
			}).then(function(resultHNode){
				resultHNode._id.toHexString().should.equal(idString);
				resultHNode.title.should.equal(newTitle);
				done();
			}).catch(function(error){
				done(error);
			});
        });
        it("should add new fields if necessary", function(done){
            var newTitle = "Altered test hNode";
            var someNewValue= "some new value";
            var testHNode = utilities.getTestHNode();
			var idString = testHNode._id;
            repository.insert(testHNode).then(function(){
				testHNode.title = newTitle;
				testHNode.anotherField = someNewValue;
				cleanUpQueue.push(testHNode);
				return repository.update(testHNode);
			}).then(function(){
				return repository.get(testHNode._id);
			}).then(function(resultHNode){
				resultHNode._id.toHexString().should.equal(idString);
				resultHNode.title.should.equal(newTitle);
				resultHNode.anotherField.should.equal(someNewValue);
				done();
			}).catch(function(error){
				done(error);
			});
        })
    })

});
