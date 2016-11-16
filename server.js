const path = require('path');

const http = require('http');
const server = http.createServer();

const express = require('express');
const app = express();

server.on('request', app);

server.listen(process.env.PORT || 3000)

app.use(express.static(path.join(__dirname, 'browser')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'chess.html'));
});
