const express = require('express'),
       app = express(),
       http = require('http'),
       server = http.createServer(app),
       { Server } = require("socket.io"),
       io = new Server(server);

let quizzTitle = null;
let groupName = null;
let teacherMail = null;
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

io.on('connection', async function (client) {
       if (client.handshake.headers.origin == 'http://10.69.88.32') { // client is a teacher
              /* things to do when a teacher connects */

              client.on('checkMail', (mail) => {
                     if (!checkMail(mail)) {
                            client.emit('anotherTeacherConnected');
                            client.removeAllListeners();
                            return;
                     }
              });
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
                     resetSession();
                     client.emit('updateSessionStatus', getSessionStatus());
                     io.to('teacher').emit('teacherNotConnectedAnymore');
              });

              client.on('createSession', (data) => {
                     client.emit('sessionCreated', data);
                     io.to('student').emit('sessionCreated', data);

                     //we get the quizz data from the teacher (title, teacher, group name)
                     quizzTitle = data.quizzName;
                     teacherMail = data.mail;
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

              client.on('getNextQuestion', () => { // when the teacher clicks on the next question button   
                     if (numberCurrentQuestion == quizzQuestionsAndAnswers[1].length) { // if it's the last question
                            client.emit('endOfQuizz');
                     } else {
                            currentQuestionAndAnswers = quizzQuestionsAndAnswers[1][numberCurrentQuestion++]; // go to next question
                            client.emit('nextQuestion', getCurrentQuestionAndAnswers());
                     }
              });

              client.on('getStudentAnswers', () => {
                     io.to('student').emit('getAnswers');
              })
       }
       else if (client.handshake.headers.origin.includes('http://10.69.88.32:8100')) { // client is a student
              /* things to do when a student connects */
              io.to('teacher').emit('numberOfConnectedStudentChanged', ++numberOfConnectedStudents);

              /* events from student */
              client.on('studentVerificated', (studentMail) => {
                     if (listOfMails.includes(studentMail)) {
                            client.emit('doublons');
                     }
                     else {
                            client.join('student');
                            client.mail = studentMail;
                            client.emit('studentRegistered');

                            alterStudentList("add", studentMail);
                            io.to('teacher').emit('updateStudentList', getStudentsInformations());

                            client.on('studentAnswers', (data) => { // rename later
                                   io.to('teacher').emit('studentAnswers', {
                                          mail: client.mail,
                                          answers: data.answers,
                                          groupName: groupName,
                                          quizzTitle: quizzTitle,
                                          teacherMail: data.mail,
                                          isCorrectAnswer: checkAnswers(data.answers,
                                                 quizzQuestionsAndAnswers[1][getCurrentQuestionAndAnswers().currentQuestionNumber - 2][1], // list of possible answers
                                                 quizzQuestionsAndAnswers[1][getCurrentQuestionAndAnswers().currentQuestionNumber - 2][2] // list of good answers
                                          )
                                   })
                            });

                            client.on('disconnecting', () => { // Remove student from the list when he disconnects & update teacher's list
                                   alterStudentList("remove", client.mail);
                                   io.to('teacher').emit('updateStudentList', getStudentsInformations());
                            })
                     }
              });

              client.on('studentDisconnect', (student) => { // Remove student from the list when he disconnects & update teacher's list
                     alterStudentList("remove", student.mail);
                     io.to('teacher').emit('updateStudentList', getStudentsInformations());
              });

              client.on('disconnect', () => { // Update the number of connected students when a student disconnects
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
       return teacherMail == null || mail == teacherMail;
}

function getSessionStatus() {
       let json = {
              sessionStatus: sessionStatus,
              quizzTitle: quizzTitle,
              groupName: groupName,
              teacher: teacherMail,
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
       teacherMail = null;
       sessionStatus = "CreateSession";
       numberOfConnectedStudents = 0;
       numberOfRegisteredStudents = 0;
       listOfStudents = [];
       quizzQuestionsAndAnswers = null;
       numberCurrentQuestion = 0;
       return;
}

function checkAnswers(studentAnswers, possibleAnswers, correctAnswers) {
       for (let i = 0; i < possibleAnswers.length; i++) {
              if (studentAnswers[i] == true && !correctAnswers.includes(possibleAnswers[i])) {
                     return false;
              }
              if (studentAnswers[i] == false && correctAnswers.includes(possibleAnswers[i])) {
                     return false;
              }
       }
       return true;
}

function alterStudentList(action, mail) {
       if (action == "add") {
              numberOfRegisteredStudents++;
              let tempsNewStudent = { mail: mail, status: "registered" };
              listOfStudents.push(tempsNewStudent);
              listOfMails.push(mail);

       } else if (action == "remove") {
              numberOfRegisteredStudents--;
              listOfMails.splice(mail, 1);
              listOfStudents.forEach(student => {
                     if (student.mail === mail) {
                            student.status = "not registered anymore";
                     }
              });
       }
       return;
}

server.listen(8100);