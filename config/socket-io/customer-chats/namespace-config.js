

const createAndConfigureCustomerChatsNamespace = (io) => {
	const customerChatsWSNamespace = io.of('/customer-messages');


	customerChatsWSNamespace.on('connect', (socket) => {

		//Disconnect Event Listener
		socket.on('disconnect', () => {});

		//Validate Chat ID


		//Customer Message Send Listener
		/*
		* message recived
		* update database
		* emit message to all customer sockets
		* emit message to all relevant cssa sockets
		* */

	});
};

//Emit Message Received Event Response
/*
* Get all sockets of customer with chat ID
* Emit to all sockets with a for each
 */

exports.createAndConfigureCustomerChatsNamespace = createAndConfigureCustomerChatsNamespace;