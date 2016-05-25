
(function(data){
	var collections = require("../config").collections;
	var Base = require("./BaseRepository");
	
	// create repositories specified in the config
	collections.forEach(function(collection){
		if (!collection.customRepository){
			data[collection.name] = new Base(collection.name, collection.prettyName);
		}
	});
	
	// create custom repositories
	data.userRoot = require("./userRootRepository");
})(module.exports);
