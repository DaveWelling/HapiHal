(function () {
	angular.module("common", []);
	//angular.module("hTree", ["hNode"]);
	angular.module("hNode", ["common"]);
	//angular.module("hNav", ["hNode", "ui.bootstrap"]);
	angular.module("app", ["ui.router",'formly', 'common']);
})();