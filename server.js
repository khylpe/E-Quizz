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

let te = 0;

let currentQuestionAndAnswers;

// Enable access to the src folder :
app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

// Express routing :
app.get('/', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});

io.on('connection', function (client) {
       console.log(client.handshake.headers.origin);
       if (client.handshake.headers.origin.includes('http://10.69.88.55')) { // client is a teacher
              /* things to do when a teacher connects */

              client.on('checkMail', (mail) => {
                     if (!checkMail(mail)) {
                            client.emit('anotherTeacherConnected');
                            client.removeAllListeners();
                     } else {
                            client.join("teacher");
                            client.emit('teacherConnected');
                            client.emit('updateSessionStatus', getSessionStatus()); // send the session status to the teacher when he connects (in case he refreshed the page)

                            if (sessionStatus == "CreateSession") {
                            }
                            else if (sessionStatus == "SessionStatus") {
                                   client.emit('updateStudentList', getStudentsInformations())

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

                            client.on('getNextQuestion', () => { 
                                   console.log("zzzzzzzzzzzz");
                                   // console.log(quizzQuestionsAndAnswers[1][0][0])
                                
                                   if (numberCurrentQuestion == quizzQuestionsAndAnswers[1].length) { // if it's the last question
                                          client.emit('endOfQuizz');
                                   } else {
                                          currentQuestionAndAnswers = quizzQuestionsAndAnswers[1][numberCurrentQuestion+ 0.5]; // go to next question
                                          console.log(currentQuestionAndAnswers);
                                          client.emit('nextQuestion', getCurrentQuestionAndAnswers());
                                   }
                            });

                            client.on('getStudentsAnswers', () => {
                                   io.to('student').emit('getAnswers');
                            })
                     }
              });
       }
       else if (client.handshake.headers.origin.includes('8100')) { // client is a student
              console.log('is student');
              /* things to do when a student connects */
              io.to('teacher').emit('numberOfConnectedStudentChanged', ++numberOfConnectedStudents);

              /* events from student */
              client.on('studentVerificated', (studentMail) => {
                     if (listOfMails.includes(studentMail)) {
                            client.emit('doublons');
                     }
                     else {
                            client.emit('studentRegistered');
                            client.mail = studentMail;
                            client.join('student');

                            io.to('teacher').emit('studentRegisteredChanged', {
                                   mail: studentMail,
                                   numberOfRegisteredStudents: ++numberOfRegisteredStudents,
                                   status: "registered",
                            });

                            let tempsNewStudent = { mail: studentMail, status: "registered" };
                            listOfStudents.push(tempsNewStudent);
                            listOfMails.push(studentMail)

                            client.on('studentAnswers', (data) => {
                                   io.to('teacher').emit('studentAnswers', {
                                          mail: client.mail,
                                          answers: data.answers
                                   })
                            });

                            client.on('disconnecting', () => {
                                   io.to('teacher').emit('studentRegisteredChanged', {
                                          mail: client.mail,
                                          numberOfRegisteredStudents: --numberOfRegisteredStudents,
                                          status: "not registered anymore",
                                   });
                                   listOfMails.splice(client.mail, 1);
                                   listOfStudents.forEach(student => {
                                          if (student.mail === client.mail) {
                                                 student.status = "not registered anymore";
                                          }
                                   })
                            })
                     }
              });

              client.on('studentDisconnect', (student) => {
                     io.to('teacher').emit('studentRegisteredChanged', {
                            mail: client.mail,
                            numberOfRegisteredStudents: --numberOfRegisteredStudents,
                            status: "not registered anymore",
                     });
                     listOfMails.splice(client.mail, 1);
                     listOfStudents.forEach(student => {
                            if (student.mail === client.mail) {
                                   student.status = "not registered anymore";
                            }
                     })
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