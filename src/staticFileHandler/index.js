(function (result) {

	result.register = function (server, options, next) {
		const Inert = require('inert');
		const Path = require('path');

		
		server.register(Inert, (err) => {
			// serve static html and image files
			server.route({
				method: 'GET',
				path: '/{param*}',
				handler: {
					directory: {
						path: Path.join(__dirname, '../../public'),
						listing: true
					}
				}
			});

			console.log("serving static files from path: " + Path.join(__dirname, '../../public'));

			// return not found page if handler returns a 404
			server.ext('onPostHandler', function (request, reply) {
				const response = request.response;
				if (response.isBoom && response.output.statusCode === 404) {
					return reply.file('./404.html').code(404);
				}
				return reply.continue();
			});

			next();
		});
	}

	result.register.attributes = {
		name: 'staticFileHandler'
	};
})(module.exports);