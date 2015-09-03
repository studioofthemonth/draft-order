var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);


// Define Jade templating engine
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');


// Define public
app.use('/public', express.static('public'));


// Add main route
app.get('/', function(req, res) {
    res.render('index');
});

// Start it up
require('./chat')(io);
require('./draft')(io);
server.listen(4000);
console.log('Draft-O-Tron is running on port 4000');
