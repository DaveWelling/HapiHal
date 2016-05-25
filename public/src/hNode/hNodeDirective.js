(function (module) {
	module.directive("hNode", hNode);
	hNode.$inject = ["$http", "$compile", "$q", "formlyFieldsGeneration"];
	function hNode($http, $compile, $q) {
		return {
			restrict: 'E',
			scope: { // Isolated scope
				href: '@',
				preloadedModel: '='
			},
			link: function (scope, element, iAttrs, controller) {

				// This all needs to happen in the link command because formly
				// doesn't like it if you change the field values after the
				// directive has been linked. So we have to compile the formly
				// form after we get the async http calls finished.
				if (scope.preloadedModel){
					acquireHNodeType((scope.preloadedModel))
						.then(updateModel)
						.catch(function (err) {
							console.log(err);
						});
				} else {
					acquireHNode(scope.href)
						.then(acquireHNodeType)
						.then(updateModel)
						.catch(function (err) {
							console.log(err);
						});

				}
				// TODO:  Consider extracting these next two methods into a service for reuse
				function acquireHNode(url) {
					return $http.get(url).then(function(result){
						return result.data;
					});
				}

				function acquireHNodeType(hNodeModel) {
					var defer = $q.defer();
					scope.model = hNodeModel;
					if (scope.model.type) {
						$http.get(scope.model.type).then(function(result){
							defer.resolve(result.data);
						}).catch(function(err){
							defer.reject(err);
						});
					} else {
						defer.resolve({
							title: "hDefaultNodeType",
							fields: [
								{
									"type": "input",
									"key": "title",
									"templateOptions": {
										"label": "title",
										"type": "text"
									}
								}
							]
						});
					}
					return defer.promise;
				}

				function updateModel(hNodeType) {
					var newForm;
					if (hNodeType.title== "hDefaultNodeType") {
						scope.fields = hNodeType.fields;
						newForm = angular.element("<form><formly-form model='model' fields='fields'></formly-form></form>");
					} else if (hNodeType.title == "directive") {
						newForm = angular.element("<"+hNodeType.directiveTag+" model='model' ></"+hNodeType.directiveTag+">");
					} else if (hNodeType.title == "Some Formly Form For Demo"){
						scope.fields = generateSensibleDefaultFields(scope.model);
						newForm = angular.element("<form><formly-form model='model'></formly-form></form>");
					} else if (hNodeType.html) {
						// TODO:  refactor this to be a separate service
						$http.get(hNodeType.html).then(function(result){
							newForm = angular.element(result.data);
							$compile(newForm)(scope);
							element.append(newForm);
						}).catch(function(err){
							throw err;
						});
						return;
					} else {
						throw new Error("Unsupported node type:" + hNodeType.title);
					}
					$compile(newForm)(scope);
					element.append(newForm);
				}
			}
		};
	}

	function generateSensibleDefaultFields(model){
		var fields = {

		}
	}
})(angular.module("hNode"));
