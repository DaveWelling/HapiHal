
(function(data){
    data.hNode = require("./hNodeRepository");
	data.hNodeType = require("./hNodeTypeRepository");
	data.viewType = require("./viewTypeRepository");
	data.viewJs = require("./viewJsRepository");
	data.viewHtml = require("./viewHtmlRepository");
	data.userRoot = new(require("./userRootRepository"))();
})(module.exports);
