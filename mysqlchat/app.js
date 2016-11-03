var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var mysqlModule = require("mysql");
var mysql = mysqlModule.createConnection({
	"host" 		: "localhost",
	"user" 		: "root",
	"password" 	: "",
	"database"  : "chatroom"
});

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/html/index.html");
});

/*
	Socket.io events starts here
*/

	io.on("connection", function(socket){

		socket.on("ChatMessage", function(ChatObject){
			console.log("The author is " + ChatObject.AuthorName);
			console.log("The message is " + ChatObject.ChatMessage);
			mysql.query("INSERT INTO messages (author, message) VALUES (?, ?)", [ChatObject.AuthorName, ChatObject.ChatMessage], function(){
				
				mysql.query("SELECT * FROM messages", function(err, rows){
					if (err) console.log(err);

					io.emit("MessageAddedSuccess", rows);
				});

				console.log("The Message was sent!");
			});
		});

		mysql.query("SELECT * FROM messages", function(err, rows){
			if (err) console.log(err);

			io.emit("Refresh", rows);
		});	

	});

/*
	Socket.io events ends here
*/

http.listen(3000, function(){
	console.log("Listening on port " + 3000);
});