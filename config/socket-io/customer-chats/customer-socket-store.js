
const socketStore = {};

const putSocket = (chat_id, socket) => {
	// console.log("socket store: ", socketStore);
	if(!chat_id) return;
	if(socketStore[chat_id] && Array.isArray(socketStore[chat_id])) {
		socketStore[chat_id].push(socket);
	} else {
		socketStore[chat_id] = [socket];
	}
};

const removeSocket = (chat_id, socket_id) => {
	if(socketStore[chat_id]) {
		let userSockets = socketStore[chat_id];
		let removedSocket = null;
		userSockets = userSockets.filter(socket => {
			if(socket.id === socket_id)
				removedSocket = socket;
			else
				return true;
		});
		socketStore[chat_id] = userSockets;

		return removedSocket;
	}

	return null;
};

const getSocketsByChatID = (chat_id) => {
	if(socketStore[chat_id] && Array.isArray(socketStore[chat_id]) )
		return socketStore[chat_id];
	else return [];
};

exports.putSocket = putSocket;
exports.removeSocket = removeSocket;
exports.getSocketsByChatID = getSocketsByChatID;