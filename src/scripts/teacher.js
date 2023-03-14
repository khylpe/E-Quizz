/* Description: This file contains the javascript code for the teacher page */
document.querySelector('#studentListTitle').innerHTML = `Liste des étudiants enregistrés`;
document.querySelector('#studentList').style.minHeight = document.querySelector('#numberOfConnectedStudents').offsetHeight + "px";
document.querySelector('#sectionSessionStatus').style.display = "none";
document.querySelector('#tempMessage').style.display = "none";
document.querySelector('#infosAndNumberAnswers').classList.remove('d-flex');
document.querySelector('#infosAndNumberAnswers').style.display = "none";
document.querySelector('#sectionDisplayQuestions').style.display = "none";
document.querySelector('#seeResult').style.display = "none";
document.querySelector('#leaveSession').style.display = "none";

let teacherClass = new Teacher();
let fetchData = new DB(document.querySelector('#mail').innerText);

let quizzName;
let questionsAndAnswers;

socketIO = io('http://10.69.88.55:8100', { transports: ["websocket"] });

socketIO.on('connect', () => {
       /* if checkSession event returns anotherTeacherConnected event, all events are being removed */
       socketIO.emit('checkSession', fetchData.mail, async (response) => {
              if (response == 'anotherTeacherConnected') {
                     teacherClass.tempMessage('error', `Un autre professeur est connecté. <br>`, '#tempMessage');
                     teacherClass.setCurrentSection('#sectionCreateSession');
                     disableCreateSessionButton();

                     socketIO.on('teacherNotConnectedAnymore', (data) => {
                            ableCreateSessionButton();
                            teacherClass.tempMessage('success', `Vous pouvez desormais créer une session`, '#tempMessage');
                     });
              }
              else if (response == "connectionAuthorized") {
                     await fetchData.fetchQuizzList()
                            .then(value => {     /*     [0] = error || success,                  
                                                        [1] = quizzListTitles[] || error message
                                                 */
                                   if (value[0] != "success") {
                                          teacherClass.tempMessage('error', value[1], '#tempMessage'); /* display error message */
                                          return;
                                   } else if (value[1].length > 0) { /* check if there is at least one quizz */
                                          let liListe = teacherClass.displayQuizzList(value, '#quizzList');
                                          if (liListe) {
                                                 liListe.forEach((nameInList) => {
                                                        nameInList.addEventListener('click', () => {
                                                               document.querySelector('#dropdownButtonStudentGroup').classList.remove('disabled');
                                                               document.querySelector('#quizzSelected').innerHTML = nameInList.innerHTML;
                                                        });
                                                 });
                                          }
                                   } else {
                                          teacherClass.tempMessage('error', "Il n'y a pas de quizz enregistré", '#tempMessage');
                                          return;
                                   }
                            });

                     await fetchData.fetchStudentGroups()
                            .then(value => {
                                   if (value[0] == "error") {
                                          teacherClass.tempMessage('error', value[1], '#tempMessage');
                                   }
                                   else if (value[0] == "success" && value[1].length > 0) {
                                          let liList = teacherClass.displayStudentGroups(value, '#groupsList');
                                          if (liList) {
                                                 liList.forEach((groupInList) => {
                                                        groupInList.addEventListener('click', () => {
                                                               document.querySelector('#groupSelected').innerHTML = groupInList.innerHTML;
                                                               document.querySelector('#submitCreateSession').classList.remove('disabled');
                                                        });
                                                 });
                                          }
                                   } else {
                                          teacherClass.tempMessage('error', "Il n'y a pas de groupe enregistré", '#tempMessage');
                                   }
                            });
              }
       });
});

socketIO.on('numberOfConnectedStudentChanged', (number) => {
       teacherClass.updateNumberOfConnectedStudents(number, '#numberOfConnectedStudents');
});

socketIO.on('numberOfAnswersChanged', (numberOfAnswer) => {
       document.querySelector('#numberOfAnswerSent').innerHTML = numberOfAnswer;
});



socketIO.on('updateStudentList', (data) => {
       data.listOfStudents.forEach((student) => {
              teacherClass.updateStudentList(student.mail, student.status, data.numberOfRegisteredStudents);
       });

       teacherClass.updateNumberOfConnectedStudents(data.numberOfConnectedStudents, '#numberOfConnectedStudents');
});

socketIO.on('updateSessionStatus', (data) => {
       /* sessionStatus = 'CreateSession' || 'SessionStatus' || 'DisplayQuestions' || 'SessionEnded' */
       fetchData.setGroupName(data.groupName);
       fetchData.setQuizzName(data.quizzTitle);
       fetchData.setQuizzTime(data.quizzTime);

       teacherClass.setCurrentSection(`#section${data.sessionStatus}`);

       if (data.sessionStatus != 'CreateSession') {
              teacherClass.setSessionStatus(data);
              if (data.sessionStatus != 'SessionStatus') {
                     fetchData.setQuizzTime(data.quizzTime);
              }
       }
       if (data.sessionStatus == 'SessionStatus') {
              document.querySelector('#infosAndNumberAnswers').classList.add('d-flex');
              document.querySelector('#infosAndNumberAnswers').style.display = "flex";

              document.querySelector('#numberOfAnswer').style.display = "none";
       }
       if (data.sessionStatus == 'DisplayQuestions') {
              if (data.currentQuestion.lastQuestion === true) {
                     document.querySelector('#seeResult').style.display = "inline-block";
                     document.querySelector('#nextQuestion').style.display = "none";
              }

              document.querySelector('#infosAndNumberAnswers').classList.add('d-flex');
              document.querySelector('#infosAndNumberAnswers').style.display = "flex";
              document.querySelector('#numberOfAnswer').style.display = "block";
              console.log(document.querySelector('#question').innerHTML = "ehfzjnik");
              teacherClass.displayQuestion(data.currentQuestion.currentQuestion, data.currentQuestion.currentAnswers, data.currentQuestion.currentQuestionNumber, data.currentQuestion.numberOfQuestions, '#question', '#possibleAnswers');
       }
       // if (data.sessionStatus == 'DisplayResults') {
       //        document.querySelector('#infosAndNumberAnswers').classList.remove('d-flex');
       //        document.querySelector('#infosAndNumberAnswers').style.display = "none";

       //        questionsAndAnswers = data.quizzQuestionsAndAnswers[1];
       //        seeResults();
       //        document.querySelector('#leaveSession').style.display = "inline-block";
       // }
});

socketIO.on('tempMessage', (data) => {
       teacherClass.tempMessage(data.status, data.message, '#tempMessage');
});

//////////////////////////////////////////////////////////////////////////////

document.querySelector('#logout').addEventListener('click', () => {
       socketIO.emit('resetSession');
});

document.querySelector('#createSessionForm').addEventListener('submit', (e) => {
       e.preventDefault();
       socketIO.emit('checkSession', fetchData.mail, async (response) => {
              if (response == 'anotherTeacherConnected') {
                     teacherClass.tempMessage('error', `Un autre professeur est connecté. <br>`, '#tempMessage');
                     teacherClass.setCurrentSection('#sectionCreateSession');
                     disableCreateSessionButton();
                     socketIO.on('teacherNotConnectedAnymore', (data) => {
                            teacherClass.tempMessage('success', `Vous pouvez desormais vous connecter`, '#tempMessage');
                            ableCreateSessionButton();
                     });
              }
              else if (response == "connectionAuthorized") {
                     fetchData.setGroupName(document.querySelector('#groupSelected').innerText);
                     fetchData.setQuizzName(document.querySelector('#quizzSelected').innerText);

                     socketIO.emit('createSession', {
                            quizzName: fetchData.quizzName,
                            groupName: fetchData.groupName,
                            mail: fetchData.mail
                     });
              }
       });
});

document.querySelector('#startSession').addEventListener('click', async () => {
       await fetchData.fetchQuestionsAndAnswers().then(value => {
              questionsAndAnswers = value[1];
              socketIO.emit('startSession', value);
       });
       socketIO.emit('getFirstQuestion', (questionData) => {
              document.querySelector('#numberOfAnswerSent').innerHTML = 0;

              let question, answers, questionNumber, numberOfQuestions;
              question = questionData.currentQuestion;
              answers = questionData.currentAnswers;
              questionNumber = questionData.currentQuestionNumber;
              numberOfQuestions = questionData.numberOfQuestions;
              teacherClass.displayQuestion(question, answers, questionNumber, numberOfQuestions, '#question', '#possibleAnswers');
       });
});

document.querySelector('#nextQuestion').addEventListener('click', (e) => {
       socketIO.emit('getNextQuestion', (data) => {
              document.querySelector('#numberOfAnswerSent').innerHTML = 0;

              if (data.lastQuestion === true) {
                     document.querySelector('#seeResult').style.display = "inline-block";
                     document.querySelector('#nextQuestion').style.display = "none";
              }
              let question, answers, questionNumber, numberOfQuestions;
              question = data.currentQuestion;
              answers = data.currentAnswers;
              questionNumber = data.currentQuestionNumber;
              numberOfQuestions = data.numberOfQuestions;
              teacherClass.displayQuestion(question, answers, questionNumber, numberOfQuestions, '#question', '#possibleAnswers');
       });
});

document.querySelector('#seeResult').addEventListener('click', (e) => {
       socketIO.emit('endOfQuizz', (data) => {

              data[1].forEach((student) => {
                     student.quizzResult.forEach(async (questionAnswered) => {
                            await fetchData.insertResult(student.mail, questionAnswered.questionNumber, questionAnswered.answers, questionAnswered.result);
                     });
              });              
       });
       document.querySelector('#leaveSession').style.display = "inline-block";
});

document.querySelector('#leaveSession').addEventListener('click', (e) => {
       socketIO.emit('resetSession');
       teacherClass.setCurrentSection('#sectionCreateSession');
});

function seeResults() {
       fetchData.fetchQuizzResults(questionsAndAnswers).then(value => {
              teacherClass.displayResults(value[1], value[2], '#accordionForResults')
       });
       document.querySelector('#leaveSession').style.display = "inline-block";
}

function disableCreateSessionButton() {
       buttonDisplayQuizzList = document.querySelector('#buttonDisplayQuizzList');
       buttonDisplayQuizzList.classList.add('disabled');
       buttonDisplayStudentGroup = document.querySelector('#dropdownButtonStudentGroup');
       buttonDisplayStudentGroup.classList.add('disabled');
       buttonCreateSession = document.querySelector('#submitCreateSession');
       buttonCreateSession.classList.add('disabled');
}

function ableCreateSessionButton() {
       buttonDisplayQuizzList.classList.remove('disabled');
       buttonDisplayStudentGroup.classList.remove('disabled');
       buttonCreateSession.classList.remove('disabled');
}