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

/*request(tokenURL, function(error, response, body) {
    var result = JSON.parse(body);
    request(apiURL+result.access_token, function(err, res, data) {
        console.log(data);
    });
});*/

function getconfig (url) {

    config.timestamp = parseInt(new Date().getTime() / 1000) + '';
    config.nonceStr = Math.random().toString(36).substr(2, 15);

    return new Promise(function(resolve, reject) {
        request({
            url: tokenURL
        }, function(error, response, body) {
            var res = JSON.parse(body);
            request({
                url: apiURL+res.access_token
            }, function(err, resp, data) {
                data = JSON.parse(data);
                var text = "jsapi_ticket="+data.ticket+
                            "&noncestr="+config.nonceStr+
                            "&timestamp="+config.timestamp+
                            "&url="+url;

                config.signature = crypto.createHash("sha1").update(text, 'utf8').digest("hex");

                resolve(config);
            });
        });
    });
}

app.use("/", express.static( __dirname + "/html" ));

app.use("/script", express.static( __dirname + "/script" ));

app.use("/style", express.static( __dirname + "/style" ));

app.get("/config", function(req, res) {
    getconfig(req.headers.referer).then(function(data) {
        res.send("wx.config("+JSON.stringify(data)+")");
    });
});

io.on("connection", function(socket) {
    socket.emit("hello", {msg: "hello"});

    socket.on("chat", function(data) {
        console.log(data);
        socket.emit("chat", data);
        socket.broadcast.emit("chat", data);
    })
})
