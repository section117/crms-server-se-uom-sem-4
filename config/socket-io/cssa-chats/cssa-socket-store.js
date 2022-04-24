
const socketStore = {};

const putSocket = (user_id, socket) => {
	if(socketStore[user_id] && Array.isArray(socketStore[user_id])) {
		socketStore[user_id].push(socket);
	} else {
		socketStore[user_id] = [socket];
	}
};

const removeSocket = (user_id, socket_id) => {
	if(socketStore[user_id]) {
		let userSockets = socketStore[user_id];
		let removedSocket = null;
		userSockets = userSockets.filter(socket => {
			if(socket.id === socket_id)
				removedSocket = socket;
			else
				return true;
		});
		socketStore[user_id] = userSockets;

		return removedSocket;
	}

	return null;
};

const getSocketsByUserID = (user_id) => {
	if(socketStore[user_id] && Array.isArray(socketStore[user_id]) )
		return socketStore[user_id];
	else return [];
};

exports.putSocket = putSocket;
exports.removeSocket = removeSocket;
exports.getSocketsByUserID = getSocketsByUserID;