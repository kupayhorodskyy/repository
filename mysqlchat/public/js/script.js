$(document).ready(function(){
	// DOM ready let's go!!!

	var socket = io();

	$("form#ChatForm").submit(function(e){
		e.preventDefault();
		var AuthorName = $("#chat-author").val();
		var ChatMessage = $("#chat-message").val();
		var ChatObject = {
			AuthorName: AuthorName,
			ChatMessage: ChatMessage
		};
		// trigger a server side event here
		socket.emit("ChatMessage", ChatObject);

		// for debugging purposes
		console.log(ChatObject);
	});


	socket.on("Refresh", function(ChatArray){
		$("#chat-msg-area").html("");
		ChatArray.forEach(function(item){
			$("#chat-msg-area").append('<p class="chat-msg"><span class="label label-primary">'+ item.author +':</span> ' + item.message +'</p>');
		});
	});

	socket.on("MessageAddedSuccess", function(ChatArray){
		$("#chat-msg-area").html("");
		ChatArray.forEach(function(item){
			$("#chat-msg-area").append('<p class="chat-msg"><span class="label label-primary">'+ item.author +':</span> ' + item.message +'</p>');
		});
	});
});
