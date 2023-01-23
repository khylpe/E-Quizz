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
let listOfStudents = ["dd.dd@mm.cc"];
let listOfStudentsID = [];
let numberOfConnectedStudents = 0;
let numberOfRegisteredStudents = 0;



// Enable access to the src folder :
app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

// Express routing :
app.get('/', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});

io.on('connection', function (client) {
       if (client.handshake.headers.origin == 'http://e-quizz.test') { // client is a teacher
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
                     io.to('student').emit('sessionCreated', data);

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
              client.emit('teacherConnected');


       }
       else if (client.handshake.address.includes('127.0.0.1')) { // client is a student
              console.log("je suis un étudiant");
              
              io.to('teacher').emit('numberOfConnectedStudentChanged', ++numberOfConnectedStudents)
              client.on('studentRegistered', (msg) => {                     
                     if (listOfStudents.includes(msg)) {
                            client.emit('doublons');
                     }
                     else{
                            client.join('student');
                            client.ID = createUniqueID();
                            io.to('teacher').emit('studentRegisteredChanged', {     mail:msg,
                                                                                    numberOfRegisteredStudents:++numberOfRegisteredStudents,
                                                                                    status:"registered",
                                                                                    id:client.ID
                                                                             });

                                                                             console.log(client.ID);
                     }
                     console.log("Message:" + msg);
              });

              client.on('disconnect', (client) => {
                     io.to('teacher').emit('numberOfConnectedStudentChanged', --numberOfConnectedStudents)
              });
       } else { // unknown user
              client.removeAllListeners();
              client.disconnect();
              return;
       }
});



// io.on('connection', (socket) => {
//     console.log('Un utilisateur s\est connecté')

//     socket.on('chat message', (msg) => {
//          console.log("Message:" + msg);
//      });
// })

// not registered anymore = disconnecté

server.listen(8100);

function createUniqueID() {
       let ID = Math.floor(Math.random() * 1000000);
       if (listOfStudentsID.includes(ID)) {
              createUniqueID();
       } else {
              listOfStudentsID.push(ID);
              return ID;
       }
}