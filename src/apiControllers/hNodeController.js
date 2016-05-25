const Joi = require('joi');
const Boom = require('boom');
const hNodeModel = require("../model/hNode");
(function (exports) {
	exports.init = function(server){
		server.route({
			method: 'get',
			path: '/api/hNode/{id}',
			config: {
				tags: ['api'],
				handler: function(req, reply){
					hNodeModel.get(req.params.id).then(function(result){
						reply(item);
					}).catch(function (err) {
						reply(err);
					});
				},
				validate: {
					params: {
						id: Joi.string()
							.required()
							.description('An identifier')
					}
				},
				description: "Hierarchical nodes describing the application structure."
			}
		});
	};
})(module.exports);