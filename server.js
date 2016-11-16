const path = require('path');

const http = require('http');
const server = http.createServer();

const express = require('express');
const app = express();

server.on('request', app);

server.listen(3000, function () {
    console.log('The server is listening on port 3000!');
});

app.use(express.static(path.join(__dirname, 'Browser')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'chess.html'));
});
