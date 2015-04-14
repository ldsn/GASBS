/**
  Fire !
**/

var socket = io.connect(location.host);

//var barragePool = initBarragePool(100);

var inputBoxStatus = false;

var CM = new CommentManager(document.getElementById('barrage-container'));
CM.init();

CM.start();


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

/*wx.ready(function() {
    $("button.image").on("click", function(event) {
        wx.chooseImage({
            success: chooseImage,
        });
    });
});*/

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

/*function setBarrageMessage(message) {
    var $item = $(".barrage-item:empty")[0];
    if(!$item) return false;
    $item = $($item);
    $item.text(message).animate({left: "-10%"}, 5000, "linear", function() {
        $item.empty();
        $item.css({left: "100%"});
    });
}*/

function inComingMessage(data) {
    //setBarrageMessage(data.msg);

    var obj = {
        "mode": 1,
        "text": data.msg,
        "stime": 0,
        "size": 25,
        "color": 0xffffff
    };

    CM.send(obj);

    console.log(data);
}

function chooseImage(data) {
    socket.emit("chat", {msg: data.localIds});
}
