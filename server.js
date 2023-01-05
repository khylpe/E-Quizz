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
              // https://stackoverflow.com/a/56509065/19601188
              // https://www.w3schools.com/nodejs/nodejs_mysql.asp
              // https://wtools.io/generate-sql-create-table
              // https://www.tabnine.com/code/javascript/functions/mysql/createConnection
              var connection = mysql.createConnection({
                     host: 'localhost',
                     port: 6666,
                     user: 'root',
                     password: 'admin',
                     database: "equizz"
              });

              connection.connect(function(err) {
                     if (err) throw err;
                     console.log("Connected!");
                   });
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