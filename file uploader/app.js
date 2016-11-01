var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

var server = app.listen(3000, function(){
  console.log('Example app listening on port 3000');
});



var mongo = require('mongodb').MongoClient,
client = require ('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function(err,db){
  if(err) throw err;
  client.on('connection', function(socket){
var col = db.collection('messages'),
sendStatus = function(s){
  socket.emit('status', s);
};


// Emit all messages
col.find().limit(100).sort({_id: 1}).toArray(function(err, res){
  if(err) throw err;
  socket.emit('output',res);
})

// wait for input
socket.on('input', function(data){
  var name = data.name,
  message = data.message,
  whitespacePattern = /^\s*$/;
  if(whitespacePattern.test(name) || whitespacePattern.test(message)){
   sendStatus('Name and message is required.');
  } else {
    col.insert({name: name, message: message}, function(){

// Emit Latest message to ALL clients
client.emit('output', [data]);

sendStatus({
  message: "Message sent",
  clear: true
});

    });
  }

});
});
});
