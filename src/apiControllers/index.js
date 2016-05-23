(function (results) {


	results.register = function(server, options, next){

		server.route({
			method: 'GET',
			path: '/api/status',
			config: {
				tags: ['api'],
				handler: function (request, reply) {
					return reply({ 'status': 'API Server up'});
				},
				description: "A call to verify the API server is up"
			}
		});
		
		require('./hNodeController').init(server);
		
		next();
	};
	
	results.register.attributes = {
		name: 'apiControllers'
	};
})(module.exports);