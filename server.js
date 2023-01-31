const express = require('express'),
       app = express(),
       http = require('http'),
       server = http.createServer(app),
       { Server } = require("socket.io"),
       io = new Server(server);

let quizzTitle = null;
let groupName = null;
let teacher = null;
let sessionStatus = "CreateSession";
let numberOfConnectedStudents = 0;
let numberOfRegisteredStudents = 0;
let listOfStudents = [];
let listOfMails = [];
let quizzQuestionsAndAnswers = null;
let numberCurrentQuestion = 0;

let currentQuestionAndAnswers;

// Enable access to the src folder :
app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

// Express routing :
app.get('/', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});

io.on('connection', function (client) {
       console.log(client.handshake.headers.origin);
       if (client.handshake.headers.origin.includes('http://10.191.179.176')) { // client is a teacher
              /* things to do when a teacher connects */

              client.on('checkMail', (mail) => {
                     if (!checkMail(mail)) {
                            client.emit('anotherTeacherConnected');
                            //client.removeAllListeners();
                     } else {
                            client.join("teacher");
                            client.emit('teacherConnected');
                            client.emit('updateSessionStatus', getSessionStatus()); // send the session status to the teacher when he connects (in case he refreshed the page)

                            if (sessionStatus == "CreateSession") {
                            }
                            else if (sessionStatus == "SessionStatus") {
                                   // send the number of connected students to the teacher
                                   // send the number of registered students to the teacher
                                   // send the list of students to the teacher
                            }
                            else if (sessionStatus == "DisplayQuestions") {
                                   client.emit('nextQuestion', getCurrentQuestionAndAnswers());
                            }
                            else if (sessionStatus == "DisplayResults") {
                            }

                            /* events from teacher */
                            client.on('resetSession', () => {
                                   console.log('resetSession');
                                   resetSession();
                                   client.emit('updateSessionStatus', getSessionStatus());
                                   io.to('teacher').emit('teacherNotConnectedAnymore');

                            });

                            client.on('createSession', (data) => {
                                   client.emit('sessionCreated', data);
                                   io.to('student').emit('sessionCreated', data);

                                   //we get the quizz data from the teacher (title, teacher, group name)
                                   quizzTitle = data.quizzName;
                                   teacher = data.mail;
                                   groupName = data.groupName;
                                   sessionStatus = "SessionStatus";

                                   client.emit('updateSessionStatus', getSessionStatus()); // send the session status to the teacher when he connects (in case he refreshed the page)
                            });

                            client.on('startSession', (quizzData) => {
                                   quizzQuestionsAndAnswers = quizzData; // we get the quizz data from the teacher (questions and answers)
                                   sessionStatus = "DisplayQuestions";
                                   client.emit('sessionStarted');
                                   client.emit('updateSessionStatus', getSessionStatus()); // send the session status to the teacher when he connects (in case he refreshed the page)
                            });

                            client.on('getNextQuestion', (data) => {
                                   if (numberCurrentQuestion == quizzQuestionsAndAnswers[1].length) { // if it's the last question
                                          client.emit('endOfQuizz');
                                   } else {
                                          console.log(quizzQuestionsAndAnswers);
                                          currentQuestionAndAnswers = quizzQuestionsAndAnswers[1][numberCurrentQuestion++]; // go to next question
                                          client.emit('nextQuestion', getCurrentQuestionAndAnswers());
                                   }
                            });
                     }
              });
       }
       else if (client.handshake.headers.origin.includes('8100')) { // client is a student
              console.log('is student');
              /* things to do when a student connects */
              io.to('teacher').emit('numberOfConnectedStudentChanged', ++numberOfConnectedStudents);

              /* events from student */
              client.on('studentVerificated', (msg) => {
                     if (listOfMails.includes(msg)) {
                            client.emit('doublons');
                     }
                     else {
                            client.emit('studentRegistered');
                            client.join('student');
                            io.to('teacher').emit('studentRegisteredChanged', {
                                   mail: msg,
                                   numberOfRegisteredStudents: ++numberOfRegisteredStudents,
                                   status: "registered",
                            });

                            let tempsNewStudent = { mail: msg, status: "registered" };
                            listOfStudents.push(tempsNewStudent);
                            listOfMails.push(msg)

                            client.on('coucouArthurJeSuisArrive', (data) =>{
                                   console.log(data.txt);
                            });
                     }
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

function checkMail(mail) {
       if (teacher != null && mail != teacher) { // another teacher is already connected
              return false;
       } else { // no teacher connected, allow connection
              return true;
       }
}

function getSessionStatus() {
       let json = {
              sessionStatus: sessionStatus,
              quizzTitle: quizzTitle,
              groupName: groupName,
              teacher: teacher,
       };
       return json;
}

function getStudentsInformations() {
       let json = {
              numberOfConnectedStudents: numberOfConnectedStudents,
              numberOfRegisteredStudents: numberOfRegisteredStudents,
              listOfStudents: listOfStudents
       };
       return json;
}

function getCurrentQuestionAndAnswers() {
       let json = {
              currentQuestion: currentQuestionAndAnswers[0],
              currentAnswers: currentQuestionAndAnswers[1],
              currentQuestionNumber: numberCurrentQuestion,
              numberOfQuestions: quizzQuestionsAndAnswers[1].length
       };
       return json;
}

function resetSession() {
       quizzTitle = null;
       groupName = null;
       teacher = null;
       sessionStatus = "CreateSession";
       numberOfConnectedStudents = 0;
       numberOfRegisteredStudents = 0;
       listOfStudents = [];
       quizzQuestionsAndAnswers = null;
       numberCurrentQuestion = 0;
       return;
}

server.listen(8100);