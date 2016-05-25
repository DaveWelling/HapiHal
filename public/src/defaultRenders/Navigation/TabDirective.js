(function (module) {
	module.directive("hNav", hNav);

	hNav.$inject = ["nodeMgmtService"];
	function hNav(nodeMgmtService) {
		return {
			templateUrl: "/src/hNavigation/hNavTemplate.html",
			restrict: 'E',
			scope: { // Isolated scope
				model: '='
			},
			link: link
		};
		function link(scope, element, attributes) {
			// look up children hNodes
			// get hNodeType and templates for the children
			// Create array of linked hNodes and put on the scope
			scope.navPageModels = [];
			if (scope.model) {
				scope.model.links.forEach(function (link) {
					if (link.rel === "child") {
						nodeMgmtService.getNode(link._id).then(function (hNode) {
							hNode.sequence = link.sequence;
							hNode.href = link.href;
							scope.navPageModels.push(hNode);
						})
					}
				})
			}
		}
	}
})(angular.module("hNav"));