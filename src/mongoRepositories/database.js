(function (database){
    var mongodb = require("mongodb");
    var q = require("q");
    var mongoUrl = "mongodb://localhost:27017/integrity";
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
                            db: returnedDb,
                            hNode: returnedDb.collection("hNode"),
                            hNodeType: returnedDb.collection("hNodeType"),
                            viewType: returnedDb.collection("viewType"),
                            viewJs: returnedDb.collection("viewJs"),
                            viewHtml: returnedDb.collection("viewHtml"),
                            userRoot: returnedDb.collection("userRoot")
                        };
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

    database.removeCollection = function(collectionName){
        var deferred = q.defer();
        try {
            database.getDb(function (err, db) {
                if (err) {
                    deferred.reject("Database initialization failed with error: " + err);
                    return;
                }
                db[collectionName].deleteMany({}, function(err){
                    if (err) {
                        console.log("Failed to empty collection " + _prettyCollectionName + ".");
                        deferred.reject("Failed to empty collection " + _prettyCollectionName + ". Error:" + err);
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
