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
let listOfStudents = [];
let listOfMails = [];
let quizzQuestionsAndAnswers = null;
let numberOfRegisteredStudents = 0;
let quizzTime = null;
let questionNumber = 1;

// Enable access to the src folder :
app.use(express.static('src')); // https://stackoverflow.com/a/54747432/19601188

// Express routing :
app.get('/', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});

io.on('connection', async function (client) {
       if (client.handshake.headers.origin == 'http://10.69.88.55') { // client is a teacher
              /* things to do when a teacher connects */

              client.on('checkSession', (mail, callback) => {
                     console.log('checkSession')
                     if (!checkMail(mail)) {
                            callback("anotherTeacherConnected")
                            client.removeAllListeners();
                            client.disconnect();
                            return;
                     } else {
                            callback("connectionAuthorized");
                            teacherMail = mail;
                     }
              });
              client.join("teacher");
              client.emit('updateSessionStatus', getSession()); // send the session status to the teacher when he connects (in case he refreshed the page)

              if (sessionStatus == "CreateSession") {
              }
              else if (sessionStatus == "SessionStatus") {
                     client.emit('updateStudentList', getStudentsInformations())
                     // send the number of connected students to the teacher
                     // send the number of registered students to the teacher
                     // send the list of students to the teacher
              }
              else if (sessionStatus == "DisplayQuestions") {
              }
              else if (sessionStatus == "DisplayResults") {
              }

              /* events from teacher */
              client.on('resetSession', () => {
                     resetSession();
                     io.disconnectSockets();
                     client.emit('updateSessionStatus', getSession());
                     io.to('teacher').emit('teacherNotConnectedAnymore');
              });

              client.on('createSession', (data) => {
                     //we get the quizz data from the teacher (title, teacher, group name)
                     quizzTitle = data.quizzName;
                     groupName = data.groupName;

                     sessionStatus = "SessionStatus";

                     client.emit('updateSessionStatus', getSession()); // send the session status to the teacher when he connects (in case he refreshed the page)
                     client.emit('tempMessage',
                            {
                                   status: 'success',
                                   message: `session créée, les étudiants peuvent maintenant se connecter.  <br> Titre du quizz : ${data.quizzName} <br> Groupe : ${data.groupName}`
                            });
              });

              client.on('startSession', (quizzData) => {
                     quizzQuestionsAndAnswers = quizzData; // we get the quizz data from the teacher (questions and answers)

                     if (quizzQuestionsAndAnswers[1].length == 0) { // if there is no question
                            client.emit('tempMessage', {
                                   status: "error",
                                   message: "There is no question in this quizz"
                            });
                            return;
                     }
                     else if (getNumberOfRegisteredStudent() == 0) { // if there is no student registered
                            client.emit('tempMessage', {
                                   status: "error",
                                   message: "There is no student registered"
                            });
                            return;
                     }

                     quizzTime = getTime();
                     io.to('student').emit('sessionStarted');

                     sessionStatus = "DisplayQuestions";
                     client.emit('updateSessionStatus', getSession()); // send the session status to the teacher when he connects (in case he refreshed the page)

                     io.to('teacher').emit('tempMessage',
                            {
                                   status: 'success',
                                   message: 'La session a été démarrée'
                            });
              });

              client.on('getFirstQuestion', (callback) => { // when the teacher clicks on the next question button
                     if (getNumberOfRegisteredStudent() > 0) {
                            listOfStudents.forEach(student => {
                                   student.answerValidated = false;
                            });
                            callback(getCurrentQuestion());
                            questionNumber++;

                     }
                     else {
                            client.emit('tempMessage', {
                                   status: "error",
                                   message: "There is no student registered"
                            });
                     }
              });


              client.on('getNextQuestion', (callback) => { // when the teacher clicks on the next question button
                     if (getNumberOfRegisteredStudent() > 0) {
                            listOfStudents.forEach(student => {
                                   student.answerValidated = false;
                            });

                            callback(getCurrentQuestion());

                            io.timeout(5000).to('student').emit('getStudentAnswer', { numberQuestion: quizzQuestionsAndAnswers[1][questionNumber - 1][3] }, (err, responses) => {
                                   if (err) {
                                          io.to('teacher').emit('tempMessage',
                                                 {
                                                        status: "error",
                                                        message: "An error occured while getting the student answers"
                                                 });
                                   }
                                   else {
                                          responses.forEach(response => {
                                                 io.to('teacher').emit('studentAnswerResult', {
                                                        teacherMail: teacherMail,
                                                        studentMail: response.studentMail,
                                                        groupName: groupName,
                                                        quizzTitle: quizzTitle,
                                                        questionNumber: quizzQuestionsAndAnswers[1][questionNumber - 3][3],
                                                        studentAnswers: getAnswersAsString(response.answers, quizzQuestionsAndAnswers[1][questionNumber - 3][1]),
                                                        resultQuestion: checkAnswers(response.answers,
                                                               quizzQuestionsAndAnswers[1][questionNumber - 3][1], // list of possible answers
                                                               quizzQuestionsAndAnswers[1][questionNumber - 3][2] // list of good answers
                                                        )
                                                 });
                                          })
                                   }
                            });
                            questionNumber++;
                     }
                     else {
                            client.emit('tempMessage', {
                                   status: "error",
                                   message: "There is no student registered"
                            });
                     }
              });

              client.on('endOfQuizz', () => {
                     io.to('student').emit('endOfQuizzTeacher');
                     io.timeout(5000).to('student').emit('getStudentAnswer', { numberQuestion: quizzQuestionsAndAnswers[1][questionNumber - 1][3] }, (err, responses) => {
                            if (err) {
                                   io.to('teacher').emit('tempMessage',
                                          {
                                                 status: "error",
                                                 message: "An error occured while getting the student answers"
                                          });
                            }
                            else {
                                   responses.forEach(response => {
                                          io.to('teacher').emit('studentAnswerResult', {
                                                 teacherMail: teacherMail,
                                                 studentMail: response.studentMail,
                                                 groupName: groupName,
                                                 quizzTitle: quizzTitle,
                                                 questionNumber: quizzQuestionsAndAnswers[1][questionNumber - 3][3],
                                                 studentAnswers: getAnswersAsString(response.answers, quizzQuestionsAndAnswers[1][questionNumber - 3][1]),
                                                 resultQuestion: checkAnswers(response.answers,
                                                        quizzQuestionsAndAnswers[1][questionNumber - 3][1], // list of possible answers
                                                        quizzQuestionsAndAnswers[1][questionNumber - 3][2] // list of good answers
                                                 )
                                          });
                                   })
                            }
                     });
                     questionNumber++;
              })
              client.on('rdyToDisplayAnswers', () => {
                     sessionStatus = "DisplayResults";
                     client.emit('updateSessionStatus', getSession()); // send the session status to the teacher when he connects (in case he refreshed the page)
              });
       }
       else if (client.handshake.headers.origin.includes('http://10.69.88.32:8100')) { // client is a student
              /* things to do when a student connects */
              io.to('teacher').emit('numberOfConnectedStudentChanged', ++numberOfConnectedStudents);

              /* events from student */
              client.on('studentTriesToRegister', (studentMail) => {
                     if (listOfMails.includes(studentMail)) {
                            client.emit('doublons');
                     }
                     else {
                            client.join('student');
                            client.mail = studentMail;
                            client.emit('studentRegistered', getSession().sessionStatus);

                            if (getSession().sessionStatus == "DisplayQuestions") {
                                   client.emit('sessionStarted');
                            }

                            alterStudentList("add", studentMail);
                            io.to('teacher').emit('updateStudentList', getStudentsInformations());

                            client.on('buttonValidateClicked', (value) => {
                                   listOfStudents.forEach(student => {
                                          if (student.mail == client.mail) {
                                                 if (value == true) {
                                                        student.answerValidated = true;

                                                 } else if (value == false) {
                                                        student.answerValidated = false;
                                                 }
                                          }
                                   });
                                   io.to('teacher').emit('numberOfAnswersChanged', getNumberOfAnswers());
                            });

                            client.on('disconnecting', () => { // Remove student from the list when he disconnects & update teacher's list
                                   alterStudentList("remove", client.mail);
                                   io.to('teacher').emit('updateStudentList', getStudentsInformations());
                            });
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

function getSession() {
       return {
              sessionStatus: sessionStatus,
              quizzTitle: quizzTitle,
              groupName: groupName,
              teacher: teacherMail,
              quizzQuestionsAndAnswers: quizzQuestionsAndAnswers,
              quizzTime: quizzTime,
              currentQuestion: getCurrentQuestion(),
              numberOfAnswers: getNumberOfAnswers()
       };
}

function getStudentsInformations() {
       return {
              numberOfConnectedStudents: numberOfConnectedStudents,
              numberOfRegisteredStudents: getNumberOfRegisteredStudent(),
              listOfStudents: listOfStudents
       };
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
       questionNumber = 0;
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

function getAnswersAsString(answersStudent, answersPossibility) {
       let tab = [];
       answersStudent.forEach((answers, index) => {
              if (answers === true) {
                     tab.push(answersPossibility[index]);
              }
       })
       for (let i = 0; i < 4; i++) {
              if (tab[i] == undefined) { // si tableau pas rempli, remplace index vide par null
                     tab[i] = null;
              }
       }
       return tab;
}

function getNumberOfRegisteredStudent() {
       let numberOfRegisteredStudents = 0;
       listOfStudents.forEach(student => {
              if (student.status == "registered") {
                     numberOfRegisteredStudents++;
              }
       });
       return numberOfRegisteredStudents;
}

function getTime() {
       var now = new Date();
       let todayDate = new Date().toISOString().slice(0, 10).replace('T', ' ');

       var hours = now.getHours();
       var minutes = now.getMinutes();
       var seconds = now.getSeconds();

       if (hours < 10) {
              hours = "0" + hours;
       }
       if (minutes < 10) {
              minutes = "0" + minutes;
       }
       if (seconds < 10) {
              seconds = "0" + seconds;
       }
       return todayDate + ' ' + hours + ":" + minutes + ":" + seconds;
}

function getCurrentQuestion() {
       let lastQuestion = new Boolean(false);
       if (quizzQuestionsAndAnswers == null || quizzQuestionsAndAnswers[1].length == 0 || questionNumber > quizzQuestionsAndAnswers[1].length) {
              return null;
       }
       if (quizzQuestionsAndAnswers[1].length == questionNumber) {
              lastQuestion = true;
       }
       return {
              currentQuestion: quizzQuestionsAndAnswers[1][questionNumber - 1][0],
              currentAnswers: quizzQuestionsAndAnswers[1][questionNumber - 1][1],
              currentQuestionNumber: quizzQuestionsAndAnswers[1][questionNumber - 1][3],
              numberOfQuestions: quizzQuestionsAndAnswers[1].length,
              lastQuestion: lastQuestion
       }
}

function getNumberOfAnswers() {
       let numberOfAnswers = 0;
       listOfStudents.forEach(student => {
              if (student.answerValidated == true) {
                     numberOfAnswers++;
              }
       });
       return numberOfAnswers;
}
server.listen(8100);