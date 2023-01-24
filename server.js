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
let numberOfRegisteredStudents = 0;
let listOfStudents = [];
let quizz = null;
let currentQuestion = 0;

// Enable access to the src folder :
app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

// Express routing :
app.get('/', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});

io.on('connection', function (client) {
       if (client.handshake.headers.origin == 'http://e-quizz.test') { // client is a teacher
              /* things to do when a teacher connects */
              client.join("teacher");
              client.emit('teacherConnected');
              client.emit('numberOfConnectedStudentChanged', numberOfConnectedStudents);
              client.emit('sessionStatus', {
                     sessionStatus: sessionStatus,
                     quizzTitle: quizzTitle,
                     groupName: groupName,
                     teacher: teacher,
                     numberOfConnectedStudents: numberOfConnectedStudents,
                     listOfRegisteredStudents: listOfStudents,
                     numberOfRegisteredStudents: numberOfRegisteredStudents
              });

              /* events from teacher */
              client.on('resetSession', () => {
                     quizzTitle = null;
                     groupName = null;
                     teacher = null;
                     sessionStatus = "notConnected";
                     numberOfConnectedStudents = 0;
                     numberOfRegisteredStudents = 0;
                     listOfStudents = [];
                     io.to("teacher").emit('sessionStatus', {
                            sessionStatus: sessionStatus,
                            quizzTitle: quizzTitle,
                            groupName: groupName,
                            teacher: teacher,
                            numberOfConnectedStudents: numberOfConnectedStudents,
                            listOfRegisteredStudents: listOfStudents,
                            numberOfRegisteredStudents: numberOfRegisteredStudents

                     });
                     return;
              });

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
                            numberOfConnectedStudents: numberOfConnectedStudents,
                            listOfRegisteredStudents: listOfStudents,
                            numberOfRegisteredStudents: numberOfRegisteredStudents
                     });
              });

              client.on('startSession', (quizzData) => {
                     sessionStatus = "DisplayQuestions";
                     io.to('teacher').emit('sessionStatus', {
                            sessionStatus: sessionStatus,
                            quizzTitle: quizzTitle,
                            groupName: groupName,
                            teacher: teacher,
                            numberOfConnectedStudents: numberOfConnectedStudents,
                            listOfRegisteredStudents: listOfStudents,
                            numberOfRegisteredStudents: numberOfRegisteredStudents
                     });
                     io.to('teacher').emit('sessionStarted');
                     quizz = quizzData;
              });
              client.on('getNextQuestion', (data) => {
                     let questionAndAnswers = quizz[1][currentQuestion++];
                     console.log(questionAndAnswers);
                     io.to('teacher').emit('nextQuestion', {question: questionAndAnswers[0], answers: questionAndAnswers[1], questionNumber: currentQuestion, numberOfQuestions: quizz[1].length});
              });              
       }
       else if (client.handshake.address.includes('127.0.0.1')) { // client is a student
              /* things to do when a student connects */
              io.to('teacher').emit('numberOfConnectedStudentChanged', ++numberOfConnectedStudents);

              /* events from student */
              client.on('studentRegistered', (msg) => {
                     listOfStudents.forEach(element => {
                            if (element.mail == msg) {
                                   client.emit('doublons');
                                   return;
                            }
                     });

                     client.join('student');
                     io.to('teacher').emit('studentRegisteredChanged', {
                            mail: msg,
                            numberOfRegisteredStudents: ++numberOfRegisteredStudents,
                            status: "registered",
                     });

                     let tempsNewStudent = { mail: msg, status: "registered" };
                     listOfStudents.push(tempsNewStudent);
              });

              client.on('disconnect', (client) => {
                     io.to('teacher').emit('numberOfConnectedStudentChanged', --numberOfConnectedStudents)
              });
       } else { // unknown user
              /* things to do when an unknown user connects */
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

/*function createUniqueID() {
       let ID = Math.floor(Math.random() * 1000000);
       listOfStudents.forEach(element => {
              //console.log(element.id);
              if (element.id == ID) {
                     createUniqueID();
              }
              
       });
       return ID;
}*/