/* eslint-disable no-unused-vars */

/* eslint-disable no-undef */
let loaded_chats = [];
var chatelements = document.getElementsByClassName('selectchats');

function generate_message_components(messages) {
	const panel = document.getElementsByClassName('chat-panel')[0];

	console.log(messages);
	
	messages.forEach(message => {
		const div1 = document.createElement('div');
		div1.classList.add('row');
		div1.classList.add('no-gutters');
		const div2 = document.createElement('div');
		div2.classList.add('col-md-3');
    
		const div3 = document.createElement('div');
		div3.classList.add('chat-bubble');
		div3.innerText = message.message;

		if (message.is_incoming) {
			div3.classList.add('chat-bubble--left');
		}else{
			div3.classList.add('chat-bubble--right');
		}

		div1.appendChild(div2);
		div2.appendChild(div3);

		panel.appendChild(div1);
    
	});

	return true;
}

let loadMessages = async function(){
	const attribute = this.getAttribute('id');
	if (loaded_chats.length === 0 || !(loaded_chats[loaded_chats.length-1]==attribute)) {
		const chat_messages = await axios.get('/chat-messages/'+attribute);
		const msgs = chat_messages.data;
		loaded = generate_message_components(msgs);
		loaded_chats.push(attribute);
	}

};

//add event listner to chats
for (var i = 0; i < chatelements.length; i++) {
	chatelements[i].addEventListener('click', loadMessages, false);
}
