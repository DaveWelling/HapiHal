(function (module) {
	'use strict';


	module.controller('DefaultAppController', DefaultAppController);

	DefaultAppController.$inject = ["$scope"];

	function DefaultAppController($scope) {
		var vm = this;
		vm.loading = false;
		$scope.$on("loadingStatusActive", function(){
			vm.loading = true;
		});
		$scope.$on("loadingStatusInactive", function(){
			vm.loading = false;
		});
	}
})(angular.module('app'));