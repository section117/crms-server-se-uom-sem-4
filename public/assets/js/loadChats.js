/* eslint-disable no-undef */
let loaded_chats = [];

// eslint-disable-next-line no-unused-vars
let loadMessages = async function(attribute){
	
	if (loaded_chats.length === 0 || !(loaded_chats[loaded_chats.length-1]==attribute)) {
		const chat_messages = await axios.get('/chat-messages/'+attribute);
		const messages = chat_messages.data;
		console.log(messages);
		$panel = $('.chat-panel').first();
		messages.forEach(message => {
			$panel.append('<div class="row no-gutters" id='+message._id+'><div class="col-md-3'
            +(message.is_incoming?'':' offset-md-9')
            +'"><div class="chat-bubble chat-bubble--'+(message.is_incoming?'left':'right')+'">'
            +message.message+'</div></div></div>');
		});
		
		loaded_chats.push(attribute);
	}
    
};

let setCustomerDetails = async function(element){
	const chat_id = element.attr('id');
	if (loaded_chats.length === 0 || !(loaded_chats[loaded_chats.length-1]==chat_id)){
		const name = element.children('#cust-name').val();
		const email = element.children('#cust-email').val();
		console.log(name,email);
		$('#customer-name').text(name);
		$('#customer-email').text('Email - '+email);
	}
};

$chats = $('.selectchats');
$chats.click(function () {
	$('#profile-pic').show();
	setCustomerDetails($(this));
	loadMessages($(this).attr('id'));
});

