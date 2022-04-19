const { Server } = require('socket.io');
const { createAndConfigureCSSAMessagesNamespace } = require('./cssa-chats/namespace-config');

let io;

const createIO = (server) => {
	io = new Server(server, {
		serveClient: false,
	});

	//CSSA Messages Namespace
	createAndConfigureCSSAMessagesNamespace(io);

	return io;
};

exports.createIO = createIO;