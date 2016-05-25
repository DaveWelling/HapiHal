(function(module){
	module.factory("eventSink", factory);
	factory.$inject = ["$rootScope", "$timeout"];
	function factory($rootScope, _$timeout_) {
		var $timeout = _$timeout_;
		return  {
			subscribe: subscribe,
			publish: publish
		};

		function subscribe(eventName, callback, scope, timeout){
			var unsubscriber = $rootScope.$on(eventName, function(){
				var newArgs = Array.prototype.slice.call(arguments, 1);
				callback.apply(this, newArgs);
			});
			if (scope){
				scope.$on('$destroy', unsubscriber);
			}
			if (timeout){
				$timeout(unsubscriber, timeout);
			}
			return unsubscriber;
		}

		function publish(eventName){
			var newArgs = Array.prototype.slice.call(arguments, 1);
			newArgs.unshift(eventName);
			$rootScope.$emit.apply($rootScope, newArgs);
		}
	}
})(angular.module("common"));