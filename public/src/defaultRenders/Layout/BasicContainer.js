(function (module) {
	module.directive("hBasicContainer", hBasicContainer);

	function hBasicContainer() {
		return {
			templateUrl: "/src/hNavigation/hBasicContainerTemplate.html",
			restrict: 'E',
			scope: { // Isolated scope
				model :"="
			},
			link: link
		};
		function link(scope, element, attributes) {

		}
	}
})(angular.module("hNav"));