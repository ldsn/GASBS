/**
  Fire !
**/

var socket = io.connect("http://192.168.199.182:9090");

var barragePool = initBarragePool(100);


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
