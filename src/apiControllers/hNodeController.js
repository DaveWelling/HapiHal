const Joi = require('joi');
(function (exports) {
	exports.init = function(server){
		server.route({
			method: 'get',
			path: '/api/hNode/{id}',
			config: {
				tags: ['api'],
				handler: function(req, reply){
					reply({});
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