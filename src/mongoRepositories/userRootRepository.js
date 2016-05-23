

module.exports = function(){
	var mongodb = require("mongodb");
	var database = require("./database");
	var q = require("q");
	var _collectionName="userRoot";
	var _prettyCollectionName = "User Root";


	this.getByUserName = function(userName){
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

	this.insert = function(collectionItem){
		var item = fixStringIdInItem(collectionItem);
		return database.passToDb(function(deferred, db){
			db[_collectionName].insert(item, function(err) {
				if (err) {
					console.log("Failed to insert " + _prettyCollectionName + " into database.");
					deferred.reject("Failed to insert " + _prettyCollectionName + " into the database. Error:" + err);
				}
				else deferred.resolve(item);
			});
		});
	};

	this.update = function(collectionItem){
		return database.passToDb(function(deferred, db){
			var item = fixStringIdInItem(collectionItem);
			db[_collectionName].update({_id:item._id}, item, null, function(err){
				if (err){
					deferred.reject("Update of " + _prettyCollectionName + " id " + item._id + " failed with error: " + err);
				} else{
					deferred.resolve(item);
				}
			});
		});
	};


	this.remove = function(id){
		return database.passToDb(function(deferred, db){
			var objectId = fixStringId(id);

			db[_collectionName].remove({_id:objectId}, function(err, result){
				if (err) {
					deferred.reject("Remove of " + _prettyCollectionName + " with id " + objectId.toHexString() + " failed with error: " + err);
					return;
				}
				deferred.resolve(objectId);
			})
		});
	};

	this.getAll = function(){
		return database.passToDb(function(deferred, db){
			db[_collectionName].find({}).toArray(function(err, collection){
				if (err) {
					deferred.reject("getAll " + _prettyCollectionName + " failed with error:" + err);
					return;
				}
				deferred.resolve(collection);
			});
		});
	};

	this.get = function(id){
		if (!id){
			var defer = q.defer();
			defer.reject("An id is required for a get operation");
			return defer.promise
		}
		var objectId = fixStringId(id);
		return database.passToDb(function(deferred, db){
			db[_collectionName].findOne({"_id": objectId }, function (err, collectionItemFound){
				if (err){
					deferred.reject("Find of " + _prettyCollectionName + " with id " + objectId.toHexString() + " failed with error: " + err);
					return;
				}
				deferred.resolve(collectionItemFound);
			});
		});
	};

	this.fixStringIdInItem = fixStringIdInItem;

	function fixStringIdInItem(item){
		if ( item._id && ( typeof(item._id) === 'string' ) ) {
			item._id = mongodb.ObjectID.createFromHexString(item._id);
		}
		return item;
	}
	function fixStringId(id) {
		if (id && ( typeof(id) === 'string' )) {
			return mongodb.ObjectID.createFromHexString(id);
		} else {
			return id;
		}
	}
};



