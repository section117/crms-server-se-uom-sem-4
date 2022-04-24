const { Server } = require('socket.io');
const { createAndConfigureCSSAMessagesNamespace } = require('./cssa-chats/namespace-config');
const { createAndConfigureCustomerChatsNamespace } = require('./customer-chats/namespace-config');

let io;

const createIO = (server) => {
	io = new Server(server, {
		serveClient: false,
	});

	//CSSA Messages Namespace
	createAndConfigureCSSAMessagesNamespace(io);

	//Customer Chats Namespace
	createAndConfigureCustomerChatsNamespace(io);

	return io;
};

exports.createIO = createIO;