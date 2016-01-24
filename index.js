/**
  SSBB
**/

var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var request = require("request");
var crypto = require("crypto");

var config = require("./script/config.js");

var appid = process.env.WX_ID;
var secret = process.env.WX_SECRET;

config.appId = appid;

var tokenURL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appid+"&secret="+secret;
var apiURL = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=";

server.listen(9090);

// request promise -> promise
function Prequest(options) {
    return new Promise(function(resolve, reject) {
        request(options, function(error, response, body) {
            if(error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

// get access token -> promise
function getAccessToken() {
    return Prequest({
        url: tokenURL
    }).then(function(body) {
        return JSON.parse(body).access_token;
    });
}

// get config object -> promise
function getconfig (url) {
    config.timestamp = parseInt(new Date().getTime() / 1000) + '';
    config.nonceStr = Math.random().toString(36).substr(2, 15);

    return getAccessToken().then(function(access_token) {
        return Prequest({
            url: apiURL+access_token
        });
    }).then(function(body) {
        var data = JSON.parse(body);
        var text = "jsapi_ticket="+data.ticket+
                    "&noncestr="+config.nonceStr+
                    "&timestamp="+config.timestamp+
                    "&url="+url;

        config.signature = crypto.createHash("sha1").update(text, 'utf8').digest("hex");
        return config;
    });
}

// static files
app.use("/", express.static( __dirname + "/html" ));
app.use("/script", express.static( __dirname + "/script" ));
app.use("/style", express.static( __dirname + "/style" ));

// config jsonp
app.get("/config", function(req, res) {
    getconfig(req.headers.referer).then(function(data) {
        res.send("wx.config("+JSON.stringify(data)+")");
    }, function(error) {
    });
});

// socket
io.on("connection", function(socket) {
    socket.emit("hello", {msg: "hello"});

    socket.on("chat", function(data) {
        console.log(data);
        socket.emit("chat", data);
        socket.broadcast.emit("chat", data);
    });

    socket.on("img", function(data) {
        getAccessToken().then(function(access_token) {
            var url = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token="+access_token+"&media_id="+data.server_id;
            socket.emit("img", {url: url});
            socket.broadcast.emit("img", {url: url});
        });
    })
});
