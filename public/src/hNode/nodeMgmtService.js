// TODO: Add events for create, update and delete
(function (module) {
	module.service('nodeMgmtService', nodeMgmtService);

	nodeMgmtService.$inject = ["nodePersistence", "ObjectId", "$q", "eventSink"];

	function nodeMgmtService(nodePersistence, ObjectId, $q, eventSink) {

		var service = {
			getRoot: getRoot,
			getNode: getNode,
			saveNode: saveNode,
			removeNode: removeNode,
			addNewChildToNode: addNewChildToNode,
			addNewSiblingNode: addNewSiblingNode,
			getParentsFromNode: getParentsFromNode,
			getChildrenFromNode: getChildrenFromNode,
			get eventNames () { return eventNames; }
		};

		// create enumeration of event names
		var eventNames = {
			get newNode () {return  "newNode";} ,
			get updateNode () {return  "updateNode";} ,
			get removeNode () {return  "removeNode";}
		};


		// TODO: This is going to end up making a lot of unnecessary server calls
		// See about possibly creating a call queue and cleaning up the queue before sending it
		// Also consider sending the whole queue as one call to the server.
		function removeNode(nodeToRemove) {
			return $q.all([getParentsFromNode(nodeToRemove), this.getChildrenFromNode(nodeToRemove)])
				.then(function (results) {
					var connectionRemovalPromises = [];

					var parentNodes = results[0];
					_.forEach(parentNodes, function (parentNode) {
						connectionRemovalPromises.push(
							removeChildLinksFromParent(parentNode, nodeToRemove._id)
						);
					});

					// Delete the children if they have no other parents
					var childrenNodes = results[1];
					_.forEach(childrenNodes, function (childNode) {
						if (!_.any(childNode.links, function (link) {
								return link.rel === "parent" && link._id !== nodeToRemove._id;
							})) {
							connectionRemovalPromises.push(
								service.removeNode(childNode)
							);
						} else {
							connectionRemovalPromises.push(
								removeParentLinkFromChild(childNode, nodeToRemove._id)
							);
						}
					});

					return $q.all(connectionRemovalPromises).then(function () {
						var persistPromise = nodePersistence.removeNode(nodeToRemove);
						persistPromise.then(function(){
							eventSink.publish(eventNames.removeNode, nodeToRemove);
						});
						return persistPromise;
					});
				});
		}

		function removeChildLinksFromParent(parentNode, childId) {
			for (i = parentNode.links.length - 1; i >= 0; i--) {
				var link = parentNode.links[i];
				if (link._id === childId && link.rel === "child") {
					parentNode.links.splice(i, 1);
				}
			}
			return nodePersistence.updateNode(parentNode);
		}

		function removeParentLinkFromChild(childNode, parentId) {
			for (i = childNode.links.length - 1; i >= 0; i--) {
				var link = childNode.links[i];
				if (link._id === parentId && link.rel === "parent") {
					childNode.links.splice(i, 1);
				}
			}
			return nodePersistence.updateNode(childNode);
		}

		function getParentsFromNode(childNode) {
			var parentLinks = _.where(childNode.links, {rel: "parent"});
			var parentNodes = [];

			var promises = [];
			_.forEach(parentLinks, function (link) {
				promises.push(service.getNode(link._id).then(function (result) {
					parentNodes.push(result);
				}));
			});
			return $q.all(promises).then(function () {
				return parentNodes;
			});
		}

		function getChildrenFromNode(parentNode) {
			var childLinks = _.where(parentNode.links, {rel: "child"});
			var childNodes = [];

			var promises = [];
			_.forEach(childLinks, function (link) {
				promises.push(service.getNode(link._id).then(function (result) {
					childNodes.push(result);
				}));
			});
			return $q.all(promises).then(function () {
				return childNodes;
			});
		}

		function addNewSiblingNode(currentNode, parentNode, newNode) {
			if (!parentNode){
				throw new Error("A parent node must be passed because nodes can have multiple parents");
			}
			var parentLink = parentNode.links.find(function(link){
				return link._id === currentNode._id;
			});
			if (!parentLink){
				throw new Error("A parent node must be given that contains the current node as a child.");
			}
			var newSequence = parentLink.sequence + 1;
			var newChild = newNode || {
					_id: (new ObjectId()).toString(),
					title: "",
					description: "",
					links: [],
					typeId: currentNode.typeId,
					type:"/api/hNodeType/" + currentNode.typeId
				};
			return service.addNewChildToNode(parentNode, newSequence, newChild);
		}

		function addNewChildToNode(parentNode, newSequence, newChild) {
			var newNode = newChild || {
					_id: (new ObjectId()).toString(),
					title: "",
					links: [],
					typeId: parentNode.typeId,
					type:"/api/hNodeType/" + parentNode.typeId
				};
			newNode.typeId = parentNode.typeId;
			newSequence = newSequence || parentNode.links.length;
			parentNode.links = parentNode.links || [];
			parentNode.links.push({
				_id: newNode._id,
				sequence: newSequence,
				rel: "child",
				href: "/api/hNode/" + newNode._id
			});
			newNode.links.push({
				_id: parentNode._id,
				sequence: parentNode.links.length,
				rel: "parent",
				href: "/api/hNode/" + parentNode._id
			});
			for (var i = 0; i < parentNode.links.length; i++) {
				var link = parentNode.links[i];
				if (link.sequence >= newSequence && link._id !== newNode._id) {
					link.sequence++;
				}
			}
			return $q.all([
				service.saveNode(newNode),
				service.saveNode(parentNode)
			]).then(function (results) {
				eventSink.publish(eventNames.newNode, results[0]);
				return results[0]; // return the new node only;
			});
		}

		function getRoot() {
			return nodePersistence.getNode(defaultRootId)
				.then(function (root) {
					nodeHash[defaultRootId] = root.data;
					return root.data;
				}).catch(function (err) {
					if (err.status === 404) {
						return createRoot();
					}
					throw err;
				});
		}

		function getNode(id) {
			return nodePersistence.getNode(id).then(function (result) {
				return result.data;
			});
		}

		function saveNode(node) {
			node.modifiedTime = new Date().getTime();
			var shallowClone = _.clone(node);
			shallowClone.links = [];
			for (var i = 0; i < node.links.length; i++) {
				shallowClone.links.push({
					_id: node.links[i]._id,
					sequence: node.links[i].sequence,
					rel: node.links[i].rel
				});
			}
			if (!node.createdTime) {
				node.createdTime = node.modifiedTime;
				shallowClone.createdTime = node.modifiedTime;
				return nodePersistence.insertNode(shallowClone).then(function () {
					return node;
				});
			}
			return nodePersistence.updateNode(shallowClone).then(function () {
				return node;
			});
		}


		return service;
	}
})(angular.module('hNode'));