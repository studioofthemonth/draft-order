var chatLog = [{
        username: 'God',
        message: 'Let there be light!'
    }];


module.exports = function(io) {

    // Socket chat
    io.on('connection', function(socket) {

        console.log('user connected');

        // Log disconnects
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });

        // Send initial chat log of 20 most recent
        socket.emit('handshake', {
            log: chatLog.slice(-getLogLength())
        });

        socket.on('message', function(msg) {
            // TODO: add to chat log text file

            var entry = {
                username: msg.username,
                message: msg.message
            };

            chatLog.push(entry);
            io.emit('message', entry);

        });

    });

    function getLogLength() {
        // hehe, log length
        return (chatLog.length > 20) ? 20 : chatLog.length;
    }

};
