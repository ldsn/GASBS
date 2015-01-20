/**
  Fire !
**/

var socket = io.connect("http://192.168.199.182:9090");

socket.on("hello", function(data) {
    $("h2").text(data.msg);
});

socket.on("chat", function(data) {
    $li = $("<li></li>");
    $li.text(data.msg);
    $("ul").append($li);
});

$("button").on("click", function(event) {
    var message = $("input").val();
    socket.emit("chat", {msg: message});
})
