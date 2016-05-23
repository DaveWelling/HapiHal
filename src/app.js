const Hapi = require('hapi');                   
const server = new Hapi.Server();
const Blipp = require('blipp');
const Pack = require('../package');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const halacious = require('halacious');

// App Plugins
const staticFileHandler = require('./staticFileHandler');
const apiControllers = require('./apiControllers');

server.connection({ port: 1337, host: '127.0.0.1' });
const options = {
	info: {
		'title': 'Backbone API Documentation',
		'version': Pack.version
	}
};
server.register([
	// HAL processor
	halacious,
	// Serve static files
	staticFileHandler,
	// Serve REST API
	apiControllers,
	// Show routes in console with Blipp
	Blipp,
	// Needed by HapiSwagger
	Vision,
	// Create Swagger docs
	{ 'register': HapiSwagger, 'options': options }
], (err) => {
	if (err) {
		throw err;
	}
	server.start((err) => {
		if (err) {
			throw err;
		}
		console.log(`Server running at ${server.info.uri}`);
	});
});
