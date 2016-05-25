console.log("Loading demo data");
var q = require("q");
var repositories = require("../src/mongoRepositories");
var database = require("../src/mongoRepositories/database");
var insertPromises = [];
var removalPromises = [];
var collections =  require("../src/config").collections;
var data = {};
// get (via require) the scripts containing the JSON for each collection type
collections.forEach(function(collection){
	data[collection.name] = require("./demo/" +collection.name);
});
// Remove existing collections
collections.forEach(function(collection){
	removalPromises.push(database.removeCollection(collection));
	console.log("Removing contents of collection " + collection.prettName);
});
// After all collections removed
// Add them back with fresh data
q.all(removalPromises).then(function() {
	console.log("Finished removing collection contents");
	for(var dataName in data){
		if (data.hasOwnProperty(dataName)){
			data[dataName].forEach(function(record){
				insertPromises.push(repositories[dataName].insert(record));
			});
			console.log("Inserting collection " + dataName);
		}
	}
	q.allSettled(insertPromises).then(function (results) {
		var failed = false;
		results.forEach(function (result) {
			if (result.state === 'rejected') {
				console.log(result);
				failed = failed || true;
			}
		});
		if (!failed) {
			console.log("success");
		} else {
			console.log("One or more errors occurred.");
		}
		process.exit(0);
	})
}).catch(function(err){
	console.error("fail: " + ex);
	process.exit(-1);
});