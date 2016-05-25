
// Little utility to get a unique ID for a key
// Calling it more than once with the same key will return
// the original ID for that key.

module.exports = (function(){
	var ObjectID = require('mongodb').ObjectID;
	var idHash = {};
	return function(idName){
		if (idHash.hasOwnProperty(idName)){
			return idHash[idName];
		} else {
			idHash[idName] = (new ObjectID()).toHexString();
		}
		return idHash[idName];
	};
})();
