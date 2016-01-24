/**
  Fire !
**/

var socket = io.connect(location.host);

//var barragePool = initBarragePool(100);

var inputBoxStatus = false;

var CM = new CommentManager(document.getElementById('barrage-container'));
CM.init();

CM.start();


socket.on("chat", inComingMessage);
socket.on("img", inComingImage);

// bind events
$("button.send").on("click", function(event) {
    sendMessage();
});

$("input").on("keypress", function(event) {
    if(event.keyCode == 13) {
        sendMessage();
    }
});

$(".control-box .input-box").on("click", function(event) {
    event.stopPropagation();
    event.preventDefault();
});

$(".control-box").on("click", function(event) {
    $(".input-box").toggleClass("show");
});


// bind image events
wx.ready(function() {
    $("button.image").on("click", function(event) {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            success: chooseImage,
        });
    });
});

function sendMessage() {
    var message = $("input").val();
    socket.emit("chat", {msg: message});
}

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


// got a shoot
function inComingMessage(data) {
    var obj = {
        "mode": 1,
        "text": data.msg,
        "stime": 0,
        "size": 25,
        "color": 0xffffff
    };

    CM.send(obj);
}

function inComingImage(data) {
    $("body").css("backgroundImage", "url("+data.url+")");
}

function chooseImage(data) {
    wx.uploadImage({
        localId: data.localIds,
        isShowProgressTips: 0,
        success: function(result) {
            socket.emit("img", {server_id: result.serverId});
        }
    });

}
