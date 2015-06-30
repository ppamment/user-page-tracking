var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var _ = require("underscore");

var pageViews = {};
var socketPages = {};

app.get('/', function(req, res){
    res.sendfile('templates/index.html');
});

io.on('connection', function(socket){
    socket.on("hello", function(message){
        if(!_.has(pageViews, message.location)){
            pageViews[message.location] = {};
        }
        pageViews[message.location][socket.id] = message.name;
        socket.emit("id", socket.id);
        io.emit("who", pageViews[message.location]);
        socketPages[socket.id] = message.location;
    });

    socket.on("disconnect", function(){
        if(socketPages[socket.id] != undefined){
            var page = socketPages[socket.id];
            io.emit("bye", {"id": socket.id});
            delete pageViews[page][socket.id];
            delete socketPages[socket.id];
        }
    })
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});