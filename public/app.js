var username = null,
    socket = null;


$(function() {

    username = prompt('Who the fuck is this?');

    if (username) {

        socket = io();

        socket.on('handshake', function(msg) {
            for (var i = 0; i < msg.log.length; i++) {
                onMessage(msg.log[i]);
            }
        });

        socket.on('message', function(msg) {
            onMessage(msg);
        });

        socket.on('order', function(msg) {
            var pick = 12;

            for (var i = 0; i < msg.order.length; i++) {
                onSelection({
                    number: pick,
                    team:  msg.order[i]
                });

                pick--;
            }
        });

        socket.on('tick', onTick);
        socket.on('selection', onSelection);
        socket.on('clear', onClear);

        $('form').on('submit', submitMessage);

    }

});

function onMessage(msg) {
    var row = $("<li>").html('<strong>' + msg.username + '</strong> - ' + msg.message);
    $('#messages').append(row);
    $('#messages').scrollTop(10000000000000);
}

function submitMessage(e) {
    e.preventDefault();

    socket.emit('message', {
        username: username,
        message: $('#m').val()
    });

    $('#m').val('');
}

function onTick(msg) {
    if (msg.type === 'pre') {
        $('#timer-type').text('Real draft in ');
        $('#type').text('Mock Draft');
        $('#time').text(msg.seconds);
    }
    else if (msg.type === 'draft') {
        $('#timer-type').text('Next Selection in ');
        $('#type').text('Draft In Progress');
        $('#time').text(msg.seconds);
    }
    else {
        $('#timer-type').text(' ');
        $('#type').text('Final Draft Order');
        $('#time').text(' ');
    }
}

function onSelection(msg) {
    if (msg.number === 12) {
        $('#order').empty();
    }

    var row = $("<li>").html('<strong>' + msg.number + '</strong> - ' + msg.team);
    $('#order').append(row);
}


function onClear(msg) {
    $('#order').empty();
}
