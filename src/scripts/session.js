/* Description: This file contains the javascript code for the teacher page */
document.querySelector('#studentList').style.minHeight = document.querySelector('#numberOfConnectedStudents').offsetHeight + "px";
document.querySelector('#sectionSessionStatus').style.display = "none";
document.querySelector('#tempMessage').style.display = "none";
document.querySelector('#infosAndNumberAnswers').classList.remove('d-flex');
document.querySelector('#infosAndNumberAnswers').style.display = "none";
document.querySelector('#sectionDisplayQuestions').style.display = "none";
document.querySelector('#seeResult').style.display = "none";
document.querySelector('#leaveSession').style.display = "none";

import BackSession from "./classes/back/BackSession.js";
import FrontSession from "./classes/front/FrontSession.js";

const Back = new BackSession(document.querySelector('#mail').innerText);
const Front = new FrontSession();

let socketIO = io('http://10.191.179.176:8100', {
       transports:
              ["websocket"],
       query: {
              status: 'teacher'
       }
});

socketIO.on('connect', () => {
       /* if checkSession event returns anotherTeacherConnected event, all events are being removed */
       socketIO.emit('checkSession', Back.mail, async (response) => {
              if (response == 'anotherTeacherConnected') {
                     Front.tempMessage('error', `Un autre professeur est connecté. <br>`, '#tempMessage');
                     Front.setCurrentSection('#sectionCreateSession');
                     disableCreateSessionButton();

                     socketIO.on('teacherNotConnectedAnymore', (data) => {
                            ableCreateSessionButton();
                            Front.tempMessage('success', `Vous pouvez desormais créer une session`, '#tempMessage');
                     });
              }
              else if (response == "connectionAuthorized") {
                     await Back.fetchQuizzList()
                            .then(value => {     /*     [0] = success || error,                  
                                                        [1] = quizzListTitles[] || error message
                                                 */
                                   if (value[0] != "success") {
                                          Front.tempMessage('error', value[1], '#tempMessage'); /* display error message */
                                          return;
                                   } else if (value[1].length > 0) { /* check if there is at least one quizz */
                                          let liListe = Front.displayQuizzList(value, '#quizzList');
                                          if (liListe) {
                                                 liListe.forEach((nameInList) => {
                                                        nameInList.addEventListener('click', () => {
                                                               document.querySelector('#dropdownButtonStudentGroup').classList.remove('disabled');
                                                               document.querySelector('#quizzSelected').innerHTML = nameInList.innerHTML;
                                                        });
                                                 });
                                          }
                                   } else {
                                          Front.tempMessage('error', "Il n'y a pas de quizz enregistré", '#tempMessage');
                                          return;
                                   }
                            });

                     await Back.fetchStudentGroups()
                            .then(value => {
                                   if (value[0] == "error") {
                                          Front.tempMessage('error', value[1], '#tempMessage');
                                   }
                                   else if (value[0] == "success" && value[1].length > 0) {
                                          let liList = Front.displayStudentGroups(value, '#groupsList');
                                          if (liList) {
                                                 liList.forEach((groupInList) => {
                                                        groupInList.addEventListener('click', () => {
                                                               document.querySelector('#groupSelected').innerHTML = groupInList.innerHTML;
                                                               document.querySelector('#submitCreateSession').classList.remove('disabled');
                                                        });
                                                 });
                                          }
                                   } else {
                                          Front.tempMessage('error', "Il n'y a pas de groupe enregistré", '#tempMessage');
                                   }
                            });
              }
       });
});

socketIO.on('numberOfConnectedStudentChanged', (number) => {
       Front.setNumberOfConnectedStudents(number, '#numberOfConnectedStudents');
});

socketIO.on('numberOfAnswersChanged', (numberOfAnswer) => {
       document.querySelector('#numberOfAnswerSent').innerHTML = numberOfAnswer;
});

socketIO.on('updateStudentList', (data) => {
       data.listOfStudents.forEach((student) => {
              Front.setStudentList(student.mail, student.status, data.numberOfRegisteredStudents);
       });

       Front.setNumberOfConnectedStudents(data.numberOfConnectedStudents, '#numberOfConnectedStudents');
});

socketIO.on('updateSessionStatus', (data) => {
       /* sessionStatus = 'CreateSession' || 'SessionStatus' || 'DisplayQuestion' || 'SessionEnded' */
       Back.setGroupName(data.groupName);
       Back.setQuizzName(data.quizzTitle);
       Back.setQuizzTime(data.quizzTime);

       Front.setCurrentSection(`#section${data.sessionStatus}`);

       if (data.sessionStatus != 'CreateSession') {
              Front.setSessionStatus(data);
              if (data.sessionStatus != 'SessionStatus') {
                     Back.setQuizzTime(data.quizzTime);
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
              console.log(data.currentQuestion.currentQuestion, data.currentQuestion.currentAnswers, data.currentQuestion.currentQuestionNumber, data.currentQuestion.numberOfQuestions);
              Front.setQuestion(data.currentQuestion.currentQuestion, data.currentQuestion.currentAnswers, data.currentQuestion.currentQuestionNumber, data.currentQuestion.numberOfQuestions, '#question', '#possibleAnswers');
       }
       if (data.sessionStatus == 'DisplayResults') {
              document.querySelector('#infosAndNumberAnswers').classList.remove('d-flex');
              document.querySelector('#infosAndNumberAnswers').style.display = "none";
              document.querySelector('#leaveSession').style.display = "inline-block";
              Front.displayResults(data.quizzResults, '#accordionForResults')
       }
});

socketIO.on('tempMessage', (data) => {
       Front.tempMessage(data.status, data.message, '#tempMessage');
});

//////////////////////////////////////////////////////////////////////////////

document.querySelector('#logout').addEventListener('click', () => {
       socketIO.emit('resetSession');
});

document.querySelector('#createSessionForm').addEventListener('submit', (e) => {
       e.preventDefault();
       socketIO.emit('checkSession', Back.mail, async (response) => {
              if (response == 'anotherTeacherConnected') {
                     Front.tempMessage('error', `Un autre professeur est connecté. <br>`, '#tempMessage');
                     Front.setCurrentSection('#sectionCreateSession');
                     disableCreateSessionButton();
                     socketIO.on('teacherNotConnectedAnymore', (data) => {
                            Front.tempMessage('success', `Vous pouvez desormais vous connecter`, '#tempMessage');
                            ableCreateSessionButton();
                     });
              }
              else if (response == "connectionAuthorized") {
                     Back.setGroupName(document.querySelector('#groupSelected').innerText);
                     Back.setQuizzName(document.querySelector('#quizzSelected').innerText);

                     socketIO.emit('createSession', {
                            quizzName: Back.quizzName,
                            groupName: Back.groupName,
                            mail: Back.mail
                     });
              }
       });
});

document.querySelector('#startSession').addEventListener('click', async () => {
       await Back.fetchQuestionsAndAnswers().then(value => {
              socketIO.emit('startSession', value);
       });
       socketIO.emit('getFirstQuestion', (questionData) => {
              document.querySelector('#numberOfAnswerSent').innerHTML = 0;

              let question, answers, questionNumber, numberOfQuestions;
              question = questionData.currentQuestion;
              answers = questionData.currentAnswers;
              questionNumber = questionData.currentQuestionNumber;
              numberOfQuestions = questionData.numberOfQuestions;
              Front.setQuestion(question, answers, questionNumber, numberOfQuestions, '#question', '#possibleAnswers');
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
              Front.setQuestion(question, answers, questionNumber, numberOfQuestions, '#question', '#possibleAnswers');
       });
});

document.querySelector('#seeResult').addEventListener('click', (e) => {
       socketIO.emit('endOfQuizz', (quizzResults) => {
              quizzResults.forEach((question) => {
                     question.answers.forEach(async (answer) => {
                            await Back.insertResult(answer.studentMail, question.questionNumber, answer.studentAnswer, answer.result);
                     });
              });
       });
       document.querySelector('#leaveSession').style.display = "inline-block";
});

document.querySelector('#leaveSession').addEventListener('click', (e) => {
       socketIO.emit('resetSession');
       Front.setCurrentSection('#sectionCreateSession');
});

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