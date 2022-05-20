
var personid= 0;


var chatelements = document.getElementsByClassName('selectchats');
var chatmsgs = document.getElementsByClassName('msgs');
var typebar = document.getElementById('777');


//hide all chats
for (var j = 0; j < chatmsgs.length; j++) {

	chatmsgs[j].style.display = 'none';

}


var myFunction = function() {
	var attribute = this.getAttribute('id');
	personid=attribute;
	
    //hide or show chat element using relevent chatid
	for (var j = 0; j < chatmsgs.length; j++) {
        
		var chatid = chatmsgs[j].getAttribute('id');
		// console.log(chatid.slice(0, -1));
		// console.log('pid is '+personid);

		if(personid===chatid.slice(0, -1)){
			chatmsgs[j].style.display = 'flex';
		}else{
			chatmsgs[j].style.display = 'none';
		}
        typebar.style.display = 'flex';

    
	}
};


//add event listner to chats
for (var i = 0; i < chatelements.length; i++) {
	chatelements[i].addEventListener('click', myFunction, false);
}

