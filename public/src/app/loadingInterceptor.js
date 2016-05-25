(function(module){
    'use strict';

    module.factory('loadingStatus', factory);

    factory.$inject = ["$q", "$rootScope"];

    function factory($q, $rootScope) {
		var activeRequests = 0;

		return {
			request: function(config) {
				started();
				return config || $q.when(config);
			},
			response: function(response) {
				ended();
				return response || $q.when(response);
			},
			responseError: function (rejection) {
				ended();
				return rejection || $q.reject(rejection);
			}
		};

		function started() {
			if(activeRequests==0) {
				$rootScope.$broadcast('loadingStatusActive');
			}
			activeRequests++;
		}

		function ended() {
			activeRequests--;
			if (activeRequests == 0) {
				$rootScope.$broadcast('loadingStatusInactive');
			}
		}
    }
})(angular.module('app'));
