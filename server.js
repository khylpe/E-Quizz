
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
let quizzQuestionsAndAnswers = null;
let quizzResults = [];
let numberOfRegisteredStudents = 0;
let quizzTime = null;
let questionNumber = 0;


// Enable access to the src folder :
app.use(express.static('src'));

// Start of Express routing :
app.get('/', (dataFromClient, serverResponse) => {
       serverResponse.sendFile(__dirname + '/student.html');
});
// End of Express routing

io.on('connection', async function (client) { // Client socket connected
       if (client.handshake.query.status == 'teacher') { // Client is a teacher
              /* things to do when a teacher connects */
              client.on('checkSession', (mail, callback) => {
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
                     client.emit('updateStudentList', getStudentsInformations());
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
                     client.emit('updateSessionStatus', getSession(false));
                     io.to('student').emit('sessionUpdated', getSession().sessionStatus);
                     io.to('teacher').emit('teacherNotConnectedAnymore');
              });

              client.on('createSession', (data) => {
                     //we get the quizz data from the teacher (title, teacher, group name)
                     quizzTitle = data.quizzName;
                     groupName = data.groupName;
                     sessionStatus = "SessionStatus";

                     client.emit('updateSessionStatus', getSession(false)); // send the session status to the teacher when he connects (in case he refreshed the page)
                     io.to('student').emit('sessionUpdated',  getSession().sessionStatus);
                            
                     io.to('student').emit('informationSession', {
                            quizzTitle: getSession().quizzTitle,
                            numberOfRegisteredStudents: getNumberOfRegisteredStudent(),
                            teacherMail: getSession().teacher,
                            groupName: getSession().groupName,
                     });

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
                     client.emit('updateSessionStatus', getSession(false)); // send the session status to the teacher when he connects (in case he refreshed the page)
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
                            callback(getQuestion());
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
                            questionNumber++;
                            callback(getQuestion());

                            io.to('boitier').emit('questionNumber', getQuestion().currentQuestionNumber); // envoie numero de question boitier
                            io.to('boitier').emit('getStudentsAnswers', (err, responses) => {
       
                                          responses.forEach(trame => {

                                          });
                                   });      
                                   
                                   
                            io.timeout(5000).to('student').emit('getStudentAnswer', { numberQuestion: getQuestion().currentQuestionNumber }, (err, responses) => {
                                   if (err) {
                                          io.to('teacher').emit('tempMessage',
                                                 {
                                                        status: "error",
                                                        message: "An error occured while getting the student answers"
                                                 });
                                   }
                                   else {
                                          quizzResults.push({
                                                 question: quizzQuestionsAndAnswers[1][getQuestion().currentQuestionNumber - 2][0],
                                                 questionNumber: quizzQuestionsAndAnswers[1][getQuestion().currentQuestionNumber - 2][3],
                                                 answers: []
                                          });

                                          responses.forEach(response => {
                                                 quizzResults[questionNumber - 1].answers.push({
                                                        'studentMail': response.studentMail,
                                                        'studentAnswer': getAnswersAsString(response.answers, quizzQuestionsAndAnswers[1][questionNumber - 1][1]),
                                                        'result': checkAnswers(response.answers,
                                                               quizzQuestionsAndAnswers[1][getQuestion().currentQuestionNumber - 2][1], // list of possible answers
                                                               quizzQuestionsAndAnswers[1][getQuestion().currentQuestionNumber - 2][2] // list of good answers
                                                        )
                                                 });
                                          })
                                   }
                                   ;
                            });
                     }
                     else {
                            client.emit('tempMessage', {
                                   status: "error",
                                   message: "There is no student registered"
                            });
                     }
              });

              client.on('endOfQuizz', (callback) => {
                     questionNumber++;
                     io.to('boitier').emit('getStudentsAnswers', (err, responses) => {
                                   responses.forEach(trame => {
                                          consonle.log(trame.numQuestion)
                                   });
                                   // responses.forEach(trame => {
                                   //        console.log("trame du boitier :", trame)


                                   //        quizzResults[questionNumber - 1].answers.push({
                                   //               'studentMail': response.//id du boitier,
                                   //        'studentAnswer': getAnswersAsString(response.answers, quizzQuestionsAndAnswers[1][questionNumber - 1][1]),
                                   //               'result': checkAnswers(response.answers,
                                   //                      quizzQuestionsAndAnswers[1][questionNumber - 1][1], // list of possible answers
                                   //                      quizzQuestionsAndAnswers[1][questionNumber - 1][2] // list of good answers
                                   //               )
                                   //        });
                                   // });
                            
                            // traiter le tableau de ahmed avec toutes les réponses.
                            // push dans quizzResults
                     });

                     io.timeout(5000).to('student').emit('getStudentAnswer', { numberQuestion: quizzQuestionsAndAnswers[1][questionNumber - 1][3] + 1  }, (err, responses) => {
                            if (err) {
                                   io.to('teacher').emit('tempMessage',
                                          {
                                                 status: "error",
                                                 message: "An error occured while getting the student answers"
                                          });
                            }
                            else {
                                   quizzResults.push({
                                          question: quizzQuestionsAndAnswers[1][questionNumber - 1][0],
                                          questionNumber: quizzQuestionsAndAnswers[1][questionNumber - 1][3],
                                          answers: []
                                   });

                                   responses.forEach(response => {
                                          quizzResults[questionNumber - 1].answers.push({
                                                 'studentMail': response.studentMail,
                                                 'studentAnswer': getAnswersAsString(response.answers, quizzQuestionsAndAnswers[1][questionNumber - 1][1]),
                                                 'result': checkAnswers(response.answers,
                                                        quizzQuestionsAndAnswers[1][questionNumber - 1][1], // list of possible answers
                                                        quizzQuestionsAndAnswers[1][questionNumber - 1][2] // list of good answers
                                                 )
                                          });
                                   });

                                   io.to('teacher').emit('tempMessage',
                                          {
                                                 status: "success",
                                                 message: "Le quizz est terminé"
                                          });

                                   sessionStatus = "DisplayResults";

                                   // Vérifie si un elève ne s'est pas déconnecté en cours de QCM
                                   listOfStudents.forEach((student) => {
                                          let tempsMail = student.mail
                                          let numero = 0;
                                          quizzResults.forEach(question => {
                                                 question.answers.forEach(answer => {
                                                        if (answer.studentMail === tempsMail) {
                                                               numero++;
                                                        }
                                                 });
                                          });

                                          if (numero != quizzResults.length) {
                                                 quizzResults.forEach((question, i) => {
                                                        question.answers.forEach((answer, index) => {
                                                               if (answer.studentMail === tempsMail) {
                                                                      quizzResults[i].answers.splice(index, 1)
                                                               }
                                                        });
                                                 });
                                          }
                                   });

                                   io.to('teacher').emit('updateSessionStatus', getSession());
                                   callback(quizzResults);
                            }
                     });

                     io.to('student').emit('endOfQuizzTeacher');
                     sessionStatus = "DisplayResults";
              })
       }
       else if (client.handshake.query.status == 'student') { // Client is a student
              /* things to do when a student connects */
              io.to('teacher').emit('numberOfConnectedStudentChanged', ++numberOfConnectedStudents);

              /* events from student */
              client.on('studentTriesToRegister', (studentMail, callback) => {
                     let mailExists = false;

                     listOfStudents.forEach(student => {
                            if (student.mail == studentMail && student.status == "registered") {
                                   mailExists = true;
                                   return;
                            }
                     });

                     if (mailExists) {
                            callback({ status: "doublons" })
                     }
                     else {
                            client.join('student');
                            client.mail = studentMail;

                            if (getSession().sessionStatus == "DisplayQuestions") {
                                   client.emit('sessionStarted');
                            }

                            alterStudentList("add", studentMail);
                            io.to('teacher').emit('updateStudentList', getStudentsInformations());

                            io.to('student').emit('informationSession', {
                                   quizzTitle: getSession().quizzTitle,
                                   numberOfRegisteredStudents: getNumberOfRegisteredStudent(),
                                   teacherMail: getSession().teacher,
                                   groupName: getSession().groupName,
                            });

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

                            client.on('answerChanged', (answer) => {
                                   quizzResults.forEach(question => {
                                          if (question.questionNumber == answer.questionNumber) {
                                                 question.answers.forEach(studentAnswer => {
                                                        if (studentAnswer.studentMail == client.mail) {
                                                               studentAnswer.studentAnswer = getAnswersAsString(answer.answers, quizzQuestionsAndAnswers[1][answer.questionNumber - 1][1]),
                                                                      studentAnswer.result = checkAnswers(answer.answers,
                                                                             quizzQuestionsAndAnswers[1][question.questionNumber - 1][1], // list of possible answers
                                                                             quizzQuestionsAndAnswers[1][question.questionNumber - 1][2] // list of good answers
                                                                      )
                                                        }
                                                 });
                                          }
                                   });
                            })

                            client.on('disconnecting', () => { // Remove student from the list when he disconnects & update teacher's list
                                   alterStudentList("remove", client.mail);
                                   io.to('teacher').emit('updateStudentList', getStudentsInformations());

                            });
                            callback({ status: "accepted", sessionStatus: getSession().sessionStatus })
                     }
              });

              client.on('studentDisconnect', () => { // Remove student from the list when he disconnects whith modal & update teacher's list
                     alterStudentList("remove", client.mail);
                     io.to('teacher').emit('updateStudentList', getStudentsInformations());

              });

              client.on('disconnect', () => { // Update the number of connected students when a student refrech this page
                     io.to('teacher').emit('numberOfConnectedStudentChanged', --numberOfConnectedStudents)
              });
       }
       else if (client.handshake.query.status == 'boitier') {
              client.join('boitier');
              io.to('boitier').emit('questionNumber', {number : 5});





       }
       else {  // Unknown client
              /* things to do when an unknown user connects */
              // console.log("Unknown user connected");
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
              quizzResults: quizzResults,
              quizzTime: quizzTime,
              currentQuestion: getQuestion(),
              numberOfAnswers: getNumberOfAnswers(),
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
       io.in('student').disconnectSockets();
       numberOfRegisteredStudents = 0;
       listOfStudents = [];
       quizzQuestionsAndAnswers = null;
       questionNumber = 0;
       quizzResults = [];
       quizzTime = null;
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
              let tempsNewStudent = { mail: mail, status: "registered", quizzResult: [], answerValidated: false };
              listOfStudents.push(tempsNewStudent);

       } else if (action == "remove") {
              numberOfRegisteredStudents--;
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

function getQuestion() {
       if (quizzQuestionsAndAnswers == null || sessionStatus != "DisplayQuestions" || quizzQuestionsAndAnswers[1].length == 0 || questionNumber > quizzQuestionsAndAnswers[1].length)
              return null;

       let isLastQuestion = quizzQuestionsAndAnswers[1].length == questionNumber + 1;

       return {
              currentQuestion: quizzQuestionsAndAnswers[1][questionNumber][0],
              currentAnswers: quizzQuestionsAndAnswers[1][questionNumber][1],
              currentQuestionNumber: quizzQuestionsAndAnswers[1][questionNumber][3],
              numberOfQuestions: quizzQuestionsAndAnswers[1].length,
              lastQuestion: isLastQuestion
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