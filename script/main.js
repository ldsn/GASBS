/**
  Fire !
**/

var socket = io.connect("http://221.217.183.113:9090");

var barragePool = initBarragePool(100);

var inputBoxStatus = false;


socket.on("hello", function(data) {
    $("h2").text(data.msg);
});

/*socket.on("chat", function(data) {
    $li = $("<li></li>");
    $li.text(data.msg);
    $("ul").append($li);
});*/

socket.on("chat", inComingMessage);

$("button.send").on("click", function(event) {
    var message = $("input").val();
    socket.emit("chat", {msg: message});
});

$(".control-box .input-box").on("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
});

$(".control-box").on("click", function(event) {
    $(".input-box").toggleClass("show");
});

wx.ready(function() {
    $("button.image").on("click", function(event) {
        wx.chooseImage({
            success: chooseImage,
        });
    });
});

function initBarragePool(count) {
    var pool = [];
    var $item = null;
    var $box = $(".barrage-box");

    for(var i=0; i<count; i++) {
        $item = $("<samp></samp>");
        $item.addClass("barrage-item");
        $box.append($item);
        pool.push($item);
    }

    return pool;
}

function setBarrageMessage(message) {
    var $item = $(".barrage-item:empty")[0];
    if(!$item) return false;
    $item = $($item);
    $item.text(message).animate({left: "-10%"}, 5000, "linear", function() {
        $item.empty();
        $item.css({left: "100%"});
    });
}

function inComingMessage(data) {
    setBarrageMessage(data.msg);
}

function chooseImage(data) {
    socket.emit("chat", {msg: data.localIds});
}
