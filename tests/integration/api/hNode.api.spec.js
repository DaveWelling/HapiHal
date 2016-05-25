
var repository = require("../../../src/mongoRepositories/index").hNode;
var request = require('supertest');
var app = require("../../../src/app.js");
var utilities = require("../../hNodeUtilities");
describe("Integration API hNode", function(){
	var chai = require("chai");
	var cleanUpQueue = [];
	before(function(){
		chai.should();
	});
	afterEach(function(){
		cleanUpQueue.forEach(function(testHNode){
			repository.remove(testHNode._id);
		});
	});
	describe("get with ID", function(){
		it("should give a json content type", function(done){
			request(app)
				.get('/api/hNode')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

		function fixLinkIds(item){
			if (!item.links) return;
			for(var i=item.links.length-1; i >= 0; i--){
				item.links[i] = repository.fixStringIdInItem(item.links[i]);
			}
		}
		it.only("should give me back one item", function(done){
			var holdHNode = utilities.getTestDatabaseHNode();
			var idString = holdHNode._id;
			fixLinkIds(holdHNode);
			repository.insert(holdHNode).then(function(hNode){
				cleanUpQueue.push(holdHNode);
				request(app)
					.get('/api/hNode/' + holdHNode._id)
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200)
					.expect(function(res){
						res.body._meta._id.should.equal(idString);
					})
					.end(done);
			}).catch(function(error){
				done(error);
			});
		});
		it("should contain a url in the type property", function(done){
			var holdHNode = utilities.getTestHNode();
			var expectedUrl = "/api/hNodeType/" + holdHNode.typeId;
			fixLinkIds(holdHNode);

			repository.insert(holdHNode).then(function(hNode){
				cleanUpQueue.push(holdHNode);
				request(app)
					.get('/api/hNode/' + holdHNode._id)
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200)
					.expect(function(res){
						res.body.type.should.equal(expectedUrl);
					})
					.end(done);
			}).catch(function(error){
				done(error);
			});
		})
	});
	describe("post", function(){
		it("should insert a new item", function(done){
			var holdHNode = utilities.getTestHNode();
			request(app)
				.post("/api/hNode")
				.set('Accept', 'application/json')
				.send(holdHNode)
				.expect(201)
				.end(function(err, res){
					if (err) done(err);
					repository.get(holdHNode._id).then(function(foundHNode){
						foundHNode._id.toHexString().should.equal(holdHNode._id);
						done();
					}).catch(function(error){
						done(error);
					});
				});
		});
		it("should ensure string IDs in links are transformed to ObjectIDs", function(done){
			var holdHNode = utilities.getTestHNode();
			request(app)
				.post("/api/hNode")
				.set('Accept', 'application/json')
				.send(holdHNode)
				.expect(201)
				.end(function(err, res){
					if (err) done(err);
					repository.get(holdHNode._id).then(function(foundHNode){
						foundHNode.links[0]._id.should.be.a("object");
						done();
					}).catch(function(error){
						done(error);
					});
				});

		});
		it("should store the hNodeType as an ObjectID", function(done){
			var holdHNode = utilities.getTestHNode();
			request(app)
				.post("/api/hNode")
				.set('Accept', 'application/json')
				.send(holdHNode)
				.expect(201)
				.end(function(err, res){
					if (err) done(err);
					repository.get(holdHNode._id).then(function(foundHNode){
						foundHNode.typeId.should.be.a("object");
						done();
					}).catch(function(error){
						done(error);
					});
				});
		});
		it("should require a typeId on the hNode", function(done){
			var holdHNode = utilities.getTestHNode();
			delete holdHNode.typeId;
			request(app)
				.post("/api/hNode")
				.set('Accept', 'application/json')
				.send(holdHNode)
				.expect(400)
				.expect(function(err, res){
					err.body.should.equal("A typeId is required.");
				})
				.end(done);
		})
	});
	describe("put", function(){
		it("should ensure string IDs in links are transformed to ObjectIDs", function(done){
			var holdHNode = utilities.getTestHNode();
			repository.insert(holdHNode).then(function(hNode) {
				cleanUpQueue.push(holdHNode);
				request(app)
					.put("/api/hNode")
					.set('Accept', 'application/json')
					.send(holdHNode)
					.expect(200)
					.end(function (err, res) {
						if (err) done(err);
						repository.get(holdHNode._id).then(function (foundHNode) {
							foundHNode.links[0]._id.should.be.a("object");
							done();
						}).catch(function (error) {
							done(error);
						});
					});
			}).catch(function(err){
				done(err);
			});
		});
		it("should update a value in the hNode", function(done){
			var holdHNode = utilities.getTestHNode();
			repository.insert(holdHNode).then(function(hNode) {
				hNode.title = "some new title";
				cleanUpQueue.push(holdHNode);
				request(app)
					.put("/api/hNode")
					.set('Accept', 'application/json')
					.send(hNode)
					.expect(200)
					.end(function (err, res) {
						if (err) done(err);
						repository.get(holdHNode._id).then(function (foundHNode) {
							foundHNode.title.should.equal("some new title");
							done();
						}).catch(function (error) {
							done(error);
						});
					});
			}).catch(function(err){
				done(err);
			});
		});
	});

});