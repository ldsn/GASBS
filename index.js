/**
  SSBB
**/

var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(9090);

app.use("/", express.static( __dirname + "/html" ));

app.use("/script", express.static( __dirname + "/script" ));

app.use("/style", express.static( __dirname + "/style" ));

io.on("connection", function(socket) {
    socket.emit("hello", {msg: "hello"});

    socket.on("chat", function(data) {
        socket.emit("chat", data);
        socket.broadcast.emit("chat", data);
    })
})
