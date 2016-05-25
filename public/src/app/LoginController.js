(function (module) {
	"use strict";


	module.controller("LoginController", LoginController);

	LoginController.$inject = ["$state", "$stateParams", "config", "$http"];

	function LoginController($state, $stateParams, config, $http){
		var vm = this;

		$http.get("/api/login/" + $stateParams.userName).then(function(res){
			config.rootId = res.data._id;
			$state.go("hNode", {"hNodeId" : config.rootId});
		});

	}
})(angular.module("app"));