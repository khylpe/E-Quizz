const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var mysql = require('mysql');

app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

let numberOfAnswers = 0;
app.get('/', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/index.html');
});

app.get('/index.html', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/index.html');
});

io.on('connection', function (client) {

       client.on('startSession', () => {
              var connection = mysql.createConnection({
                     host: 'localhost',
                     user: 'root',
                     password: ''
              });

              connection.connect();
              connection.end();
       });
       client.on('joined', (data) => {
              console.log(data);
       });
       client.on('answer', () => {
              io.emit("new answer", ++numberOfAnswers);
       });
});

io.on("close", function () {
       console.log("Browser gone.")
});

server.listen(8100, () => {
});    