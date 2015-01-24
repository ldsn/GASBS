/**
  SSBB
**/

var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var request = require("request");

var appid = "";
var secret = "";

var tokenURL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appid+"&secret="+secret;
var apiURL = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=";

server.listen(9090);

request(tokenURL, function(error, response, body) {
    var result = JSON.parse(body);
    request(apiURL+result.access_token, function(err, res, data) {
        console.log(data);
    });
});

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
