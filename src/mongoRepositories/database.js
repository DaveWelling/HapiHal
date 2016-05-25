(function (database){
    var mongodb = require("mongodb");
    var q = require("q");
    var config = require("../config");
    var mongoUrl = config.mongoConnection;
    var collections = config.collections;
    var db = null;

    database.getDb = function(next){
        if (!db){
            //connect
            try {
                mongodb.MongoClient.connect(mongoUrl,{db: { bufferMaxEntries: 0 }}, function (err, returnedDb) {
                    if (err) {
                        next(err, null);
                    } else {
                        db = {
                            db: returnedDb
                        };
                        // Create collections if necessary
                        collections.forEach(function(collection){
                            db[collection.name] = returnedDb.collection(collection.name);
                        });
                        next(null, db);
                    }
                });
            } catch(error){
                next(error, null);
            }
        } else {
            next(null, db);
        }
    };

    database.removeCollection = function(collection){
        var deferred = q.defer();
        try {
            database.getDb(function (err, db) {
                if (err) {
                    deferred.reject("Database initialization failed with error: " + err);
                    return;
                }
                db[collection.name].deleteMany({}, function(err){
                    if (err) {
                        console.log("Failed to empty collection " + collection.prettName + ".");
                        deferred.reject("Failed to empty collection " + collection.prettyName + ". Error:" + err);
                    }
                    else deferred.resolve();
                });
            });
        } catch(err){
            return deferred.reject(err);
        }
        return deferred.promise;
    };

    database.passToDb = function (methodToExecute){
        var deferred = q.defer();
        try {
            database.getDb(function (err, db) {
                if (err) {
                    deferred.reject("Database initialization failed with error: " + err);
                    return;
                }
                methodToExecute(deferred, db);
            });
        } catch(err){
            return deferred.reject(err);
        }
        return deferred.promise;
    }


})(module.exports);
