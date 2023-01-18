const express = require('express'),
       app = express(),
       http = require('http'),
       server = http.createServer(app),
       { Server } = require("socket.io"),
       io = new Server(server, { allowEIO3: true });

// Enable access to the src folder :
app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

let numberOfStudentConnected = 0,
       numberOfRegisteredStudents = 0,
       sessionStatus = "not created"; // created -- started

// Express routing :
app.get('/', (dataFromClient, serverResponse) => {
       console.log('index.html requested');
       serverResponse.sendFile(__dirname + '/index.html');
});
app.get('/student', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});
app.get('/student.html', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});

io.on('connection', function (client) {
       console.log('a user connected');
       client.to('teacher').emit('student connected changed', ++numberOfStudentConnected);

       // Signals from students (client side) when they are registered :
       client.on('student registered', (studentName) => {
              if (client.username == undefined) {
                     numberOfRegisteredStudents++;
              }
              client.username = studentName;
              client.to('teacher').emit('students registered changed', {
                     id: client.modifiedID,
                     studentName: client.username,
                     status: "registered",
                     numberOfRegisteredStudents: numberOfRegisteredStudents
              });
       });

       client.on('disconnecting', () => {
              client.to('teacher').emit('student connected changed', --numberOfStudentConnected);
              if (client.modifiedID != undefined && client.username != undefined) {
                     client.to('teacher').emit('students registered changed', {
                            id: client.modifiedID,
                            studentName: client.username,
                            status: "not registered anymore",
                            numberOfRegisteredStudents: --numberOfRegisteredStudents
                     });
              }
       });
});

server.listen(8100, () => {
});