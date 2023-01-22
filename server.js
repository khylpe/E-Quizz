const express = require('express'),
       app = express(),
       http = require('http'),
       server = http.createServer(app),
       { Server } = require("socket.io"),
       io = new Server(server);

let quizzTitle = null;
let groupName = null;
let teacher = null;
let sessionStatus = "notConnected";
let numberOfConnectedStudents = 0;

// Enable access to the src folder :
app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

// Express routing :
app.get('/', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});

io.on('connection', function (client) {
       if (client.handshake.headers.origin == 'http://e-quizz.test') {
              client.on('resetSession', () => {
                     quizzTitle = null;
                     groupName = null;
                     teacher = null;
                     sessionStatus = "notConnected";
                     numberOfConnectedStudents = 0;
                     io.to("teacher").emit('sessionStatus', {
                            sessionStatus: sessionStatus,
                            quizzTitle: quizzTitle,
                            groupName: groupName,
                            teacher: teacher,
                            numberOfConnectedStudents: numberOfConnectedStudents
                     });
                     return;
              })
              client.join("teacher");

              client.on('createSession', (data) => {
                     io.to('teacher').emit('sessionCreated', data);
                     quizzTitle = data.quizzName;
                     teacher = data.mail;
                     groupName = data.groupName;
                     sessionStatus = "SessionStatus";
                     io.to("teacher").emit('sessionStatus', {
                            sessionStatus: sessionStatus,
                            quizzTitle: quizzTitle,
                            groupName: groupName,
                            teacher: teacher,
                            numberOfConnectedStudents: numberOfConnectedStudents
                     });
              });

              client.on('startSession', (data) => {
                     io.to('teacher').emit('sessionStarted', data);
                     //sessionStatus = "created";
              });
              io.to("teacher").emit('sessionStatus', {
                     sessionStatus: sessionStatus,
                     quizzTitle: quizzTitle,
                     groupName: groupName,
                     teacher: teacher,
                     numberOfConnectedStudents: numberOfConnectedStudents
              });
       }
});

server.listen(8100);