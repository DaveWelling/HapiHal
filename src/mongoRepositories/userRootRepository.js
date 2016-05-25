(function () {

	var mongodb = require("mongodb");
	var database = require("./database");
	var q = require("q");
	var _collectionName="userRoot";
	var _prettyCollectionName = "User Root";
	var baseRepository = new (require("./BaseRepository"))(_collectionName, _prettyCollectionName);
	var userRepository = function(){
		this.getByUserName = getByUserName;
	};

	// Use base repository, but append one method.
	userRepository.prototype = baseRepository;
	function getByUserName(userName){
		var deferred = q.defer();
		database.getDb(function(err, db){
			if (err){
				deferred.reject("Database initialization failed with error: " + err);
				return;
			}
			if (!userName){
				deferred.reject("A user name must be passed into the get method");
			}
			db[_collectionName].findOne({ userName: userName }, function(err, collectionItemFound){
				if (err) {
					deferred.reject("Find of " + _prettyCollectionName + " with userName " + userName + " failed with error: " + err);
					return;
				}
				deferred.resolve(collectionItemFound);
			})
		});
		return deferred.promise;
	};
	module.exports = new userRepository();

})();