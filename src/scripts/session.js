/* Description: This file contains the javascript code for the teacher page */
document.querySelector('#studentList').style.minHeight = document.querySelector('#numberOfConnectedStudents').offsetHeight + "px";
document.querySelector('#infosAndNumberAnswers').classList.remove('d-flex');
document.querySelector('#infosAndNumberAnswers').style.display = "none";
document.querySelector('#seeResult').style.display = "none";
document.querySelector('#leaveSession').style.display = "none";

import BackSession from "./classes/back/BackSession.js";
import FrontSession from "./classes/front/FrontSession.js";

const Back = new BackSession(document.querySelector('#mail').innerText);
const Front = new FrontSession();

Front.setCurrentSection('#connectionError');

let socketIO = io('http://192.168.0.254:8100', {
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
                     Front.setCurrentSection('#connectionError');
                     document.querySelector('#errorMessage').innerHTML = "Un autre enseignant est connecté, veuillez patienter";
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
                     appendGroupListAndAddButton();
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

       switch (data.sessionStatus) {
              case 'CreateSession':
                     document.querySelector('#infosAndNumberAnswers').classList.remove('d-flex');
                     document.querySelector('#infosAndNumberAnswers').style.display = "none";
                     // if (data.sessionStatus != 'SessionStatus') {
                            Back.setQuizzTime(data.quizzTime);
                     // }
                     break;

              case 'SessionStatus':
                     Front.setSessionStatus(data);
                     document.querySelector('#infosAndNumberAnswers').classList.add('d-flex');
                     document.querySelector('#infosAndNumberAnswers').style.display = "flex";
                     document.querySelector('#numberOfAnswer').style.display = "none";
                     break;

              case 'DisplayQuestions':
                     Front.setSessionStatus(data);
                     if (data.currentQuestion.lastQuestion === true) {
                            document.querySelector('#seeResult').style.display = "inline-block";
                            document.querySelector('#nextQuestion').style.display = "none";
                     }

                     document.querySelector('#infosAndNumberAnswers').classList.add('d-flex');
                     document.querySelector('#infosAndNumberAnswers').style.display = "flex";
                     document.querySelector('#numberOfAnswer').style.display = "block";
                     Front.setQuestion(data.currentQuestion.currentQuestion, data.currentQuestion.currentAnswers, data.currentQuestion.currentQuestionNumber, data.currentQuestion.numberOfQuestions, '#question', '#possibleAnswers');
                     break;

              case 'DisplayResults':
                     Front.setSessionStatus(data);
                     document.querySelector('#infosAndNumberAnswers').classList.add('d-flex');
                     document.querySelector('#infosAndNumberAnswers').style.display = "flex";
                     numberOfAnswer.style.display = "none";
                     document.querySelector('#leaveSession').style.display = "inline-block";
                     Front.displayResults(data.quizzResults, '#accordionForResults');
                     break;

              default:

       }
});

socketIO.on('tempMessage', (data) => {
       Front.tempMessage(data.status, data.message, '#tempMessage');
});

socketIO.on('disconnect', () => {
       socketIO.emit('resetSession');
       Front.setCurrentSection('#connectionError');
       document.querySelector('#errorMessage').innerHTML = "Vous avez été déconnecté, veuillez vérifier votre connexion (WiFi) au Raspberry PI <br> <span class'fs-5 mt-5'>Nous tentons de vous reconnecter...</span>";
});

socketIO.io.on("error", (error) => {
       Front.setCurrentSection('#connectionError');
       document.querySelector('#errorMessage').innerHTML = `Une erreur s'est produite. <br> <span class'fs-5 mt-5'>Erreur : ${error}</span>`;
});

socketIO.on("connect_error", (error) => {
       Front.setCurrentSection('#connectionError');
       document.querySelector('#errorMessage').innerHTML = `Une erreur s'est produite. <br> <span class'fs-5 mt-5'>Erreur : ${error}</span>`;
});
socketIO.io.on("reconnect", (attempt) => {
       Front.setCurrentSection('#connectionError');
       document.querySelector('#errorMessage').innerHTML = `Vous avez été déconnecté, veuillez vérifier votre connexion (WiFi) au Raspberry PI <br> <span class'fs-5 mt-5'>Nous tentons de vous reconnecter... Tentative n°${attempt}</span>`;
});

socketIO.io.on("reconnect_attempt", (attempt) => {
       Front.setCurrentSection('#connectionError');
       document.querySelector('#errorMessage').innerHTML = `Vous avez été déconnecté, veuillez vérifier votre connexion (WiFi) au Raspberry PI <br> <span class'fs-5 mt-5'>Nous tentons de vous reconnecter... Tentative n°${attempt}</span>`;
});

socketIO.io.on("reconnect_error", (error) => {
       Front.setCurrentSection('#connectionError');
       document.querySelector('#errorMessage').innerHTML = `Nous n'avons pas réussi à vous reconnecter, veuillez vérifier votre connexion (WiFi) au Raspberry PI <br> <span class'fs-5 mt-5'>Erreur : ${error}</span>`;
});

socketIO.io.on("reconnect_failed", () => {
       Front.setCurrentSection('#connectionError');
       document.querySelector('#errorMessage').innerHTML = `Nous n'avons pas réussi à vous reconnecter, veuillez vérifier votre connexion (WiFi) au Raspberry PI`;
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
       window.location.replace('navigation.html');
});

document.querySelector('#refreshPage').addEventListener('click', (e) => {
       window.location.reload();
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

async function appendGroupListAndAddButton() {
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

       let createButton = Front.appendAddGroupButton('#groupsList');

       if (createButton) {
              createButton.addEventListener('click', (e) => {
                     e.preventDefault();
                     Back.createGroup(document.querySelector('#newGroupName').value)
                            .then(value => {
                                   if (value == "success") {
                                          Front.tempMessage('success', "groupe ajouté", '#tempMessage');
                                          document.querySelector('#newGroupName').value = "";
                                          appendGroupListAndAddButton();
                                   } else {
                                          Front.tempMessage('error', value[1], '#tempMessage');
                                   }
                            });
              });
       }

}