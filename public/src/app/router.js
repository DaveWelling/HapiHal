(function () {
    'use strict';

    angular.module('app')
        .config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'
		, '$httpProvider', 'config'];
    function router($stateProvider, $urlRouterProvider, $locationProvider
		, $httpProvider, config) {

		//TODO: Add oauth/SSL etc.
		$httpProvider.defaults.headers.common.integrity = "defaultUser";
		$httpProvider.interceptors.push('loadingStatus');

        $locationProvider.html5Mode({enabled: true, requireBase: false}); // Remove # from url

        $urlRouterProvider
            .when('/index.html', mainRoute)
			.when('/', mainRoute);

		function mainRoute(){
			if (config.rootId){
				return '/hNode/' + rootId; //56d1dff77d58e7500d205ec8
			} else {
				return '/login/' + config.userName;
			}
		}
        $stateProvider
			.state('hNode', {
				url: "/hNode/:hNodeId",
				params: {hNodeId: null},
				templateProvider: function($stateParams){
					return "<h-node href='/api/hNode/" + $stateParams.hNodeId + "' />";
				},
				controller: 'DefaultAppController'
			})
			.state('login', {
				url: "/login/:userName",
				params: {"userName": "defaultUser"},
				templateProvider: function($stateParams){
					return "<h1> Logging in " + $stateParams.userName + "</h1>";
				},
				controller: 'LoginController'
			});


		$urlRouterProvider
			.otherwise(mainRoute);
    }
})();