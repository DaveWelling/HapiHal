(function(module) {
    module.service('nodePersistence', nodePersistence);

    function nodePersistence($http) {
        return {
            getNode: getNode,
            updateNode: updateNode,
            insertNode: insertNode,
            removeNode: removeNode
        };
        function getNode(id) {
            return $http.get("/api/hNode/" + id);
        }
        function insertNode(workitem) {
            return $http.post("/api/hNode", workitem);
        }
        function updateNode(workitem) {
            return $http.put("/api/hNode", workitem);
        }
        function removeNode(nodeToRemove) {
            return $http.delete("/api/hNode/" + nodeToRemove._id);
        }
    }
})(angular.module('hNode'));