const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

let clients = [];

app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

app.get('/', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/index.html');
});

app.get('/index.html', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/index.html');
});

wss.on('connection', function (ws) {
       ws.send('test')
       console.log("Browser connected online...")

       ws.on("message", function (str) {
              console.log("Received: " + ob.content);
});
});

wss.on("close", function () {
       console.log("Browser gone.")
});

server.listen(8100, () => {
});    