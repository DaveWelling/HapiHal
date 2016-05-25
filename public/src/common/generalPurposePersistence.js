(function(module){
    'use strict';

    module.factory('generalPurposePersistence', factory);

    factory.$inject = ["$http"];

    function factory($http) {
        return {
            get : get
        };

        function get(url, id){
            throw new Error("Not implemented");
        }
    }
})(angular.module('common'));