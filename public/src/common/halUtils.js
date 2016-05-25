(function(module){
    'use strict';

    module.factory('halUtils', factory);

    function factory() {
        return {
            "getCuriePrefixFromPropertyName" : getCuriePrefixFromPropertyName,
			"getUrlFromCurie" : getUrlFromCurie

        };

        function getCuriePrefixFromPropertyName(propertyName){
            return propertyName.match(/\w+/)[0];
        }

		function getUrlFromCurie(halEntity, curiePrefix){
			var found = halEntity._links.curies.find(function(curie){
				return curie.name === curiePrefix;
			});
			if (found.templated){
				return found.href.replace("{rel}", "");
			}
			return found.href;
		}
    }
})(angular.module('common'));