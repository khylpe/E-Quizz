/* Description: This file contains the javascript code for the teacher page */
document.querySelector('#studentListTitle').innerHTML = `Liste des étudiants enregistrés`;
document.querySelector('#studentList').style.minHeight = document.querySelector('#numberOfConnectedStudents').offsetHeight + "px";
document.querySelector('#sectionSessionStatus').style.display = "none";
document.querySelector('#tempMessage').style.display = "none";
document.querySelector('#infosAndNumberAnswers').classList.remove('d-flex');
document.querySelector('#infosAndNumberAnswers').style.display = "none";
document.querySelector('#sectionDisplayQuestions').style.display = "none";
document.querySelector('#seeResult').style.display = "none";

mail = document.querySelector('#mail').innerText; // attention
let maClasse = new Teacher(mail);
let fetchData = new FetchDataFromDB(mail);

let quizzName;
let groupName;
let quizzTime;
let questionsAndAnswers;

socketIO = io('http://10.191.179.176:8100', { transports: ["websocket"] });

socketIO.on('connect', () => {
       /* if checkMail event returns anotherTeacherConnected event, all events are being removed */
       socketIO.emit('checkMail', mail);

       socketIO.on('anotherTeacherConnected', (data) => {
              maClasse.tempMessage('error', `Un autre professeur est connecté. <br>`, '#tempMessage');
              maClasse.setCurrentSection('#sectionCreateSession');

              /* disable buttons */
              buttonDisplayQuizzList = document.querySelector('#buttonDisplayQuizzList');
              buttonDisplayQuizzList.classList.add('disabled');
              buttonDisplayStudentGroup = document.querySelector('#dropdownButtonStudentGroup');
              buttonDisplayStudentGroup.classList.add('disabled');
              buttonCreateSession = document.querySelector('#submitCreateSession');
              buttonCreateSession.classList.add('disabled');

              socketIO.on('teacherNotConnectedAnymore', (data) => {
                     maClasse.tempMessage('success', `Vous pouvez desormais vous connecter`, '#tempMessage');
                     buttonDisplayQuizzList.classList.remove('disabled');
                     buttonDisplayStudentGroup.classList.remove('disabled');
                     buttonCreateSession.classList.remove('disabled');
              });
       });

       socketIO.on('teacherConnected', async (data) => {
              await fetchData.fetchQuizzList()
                     .then(value => {  /* [0] = error or success, [1] = quizzListTitles[] || error message */
                            if (value[0] == "error") {
                                   maClasse.tempMessage('error', value[1], '#tempMessage');
                                   return false;
                            } else if (value[0] == "success" && value[1].length > 0) {
                                   let liListe = maClasse.displayQuizzList(value, '#quizzList');
                                   if (liListe) {
                                          liListe.forEach((nameInList) => {
                                                 nameInList.addEventListener('click', () => {
                                                        document.querySelector('#dropdownButtonStudentGroup').classList.remove('disabled');
                                                        document.querySelector('#quizzSelected').innerHTML = nameInList.innerHTML;
                                                 });
                                          });
                                   }
                            } else {
                                   maClasse.tempMessage('error', "Il n'y a pas de quizz enregistré", '#tempMessage');
                                   return false;
                            }

                     });
              await fetchData.fetchStudentGroups()
                     .then(value => {
                            if (value[0] == "error") {
                                   maClasse.tempMessage('error', value[1], '#tempMessage');
                            }
                            else if (value[0] == "success" && value[1].length > 0) {
                                   let liList = maClasse.displayStudentGroups(value, '#groupsList');
                                   if (liList) {
                                          liList.forEach((groupInList) => {
                                                 groupInList.addEventListener('click', () => {
                                                        document.querySelector('#groupSelected').innerHTML = groupInList.innerHTML;
                                                        document.querySelector('#submitCreateSession').classList.remove('disabled');
                                                 });
                                          });
                                   }
                            } else {
                                   maClasse.tempMessage('error', "Il n'y a pas de groupe enregistré", '#tempMessage');
                            }
                     });
       });
});

socketIO.on('sessionStatusChanged', (data) => {
       maClasse.setCurrentSection(`#section${data}`);
});

socketIO.on('sessionCreated', (data) => {
       maClasse.tempMessage('success',
              `session créée, les étudiants peuvent maintenant se connecter.  <br> Titre du quizz : ${data.quizzName} <br> Groupe : ${data.groupName}`,
              '#tempMessage');
       maClasse.setCurrentSection('#sectionSessionStatus');
});

socketIO.on('numberOfConnectedStudentChanged', (number) => {
       maClasse.updateNumberOfConnectedStudents(number, '#numberOfConnectedStudents');
});

socketIO.on('sessionStarted', (time) => {
       maClasse.setCurrentSection('#sectionDisplayQuestions');
       maClasse.tempMessage('success', 'La session a été démarrée', '#tempMessage');
       quizzTime = time;
});

socketIO.on('nextQuestion', (data) => {
       document.querySelector('#numberOfAnswerSent').innerHTML = 0;

       let question, answers, questionNumber, numberOfQuestions;
       if (data) {
              question = data.currentQuestion;
              answers = data.currentAnswers;
              questionNumber = data.currentQuestionNumber;
              numberOfQuestions = data.numberOfQuestions;
              maClasse.displayQuestion(question, answers, questionNumber, numberOfQuestions, '#question', '#possibleAnswers');
       }
});

socketIO.on('numberOfAnswersChanged', (numberOfAnswer) => {
       document.querySelector('#numberOfAnswerSent').innerHTML = numberOfAnswer;
});

socketIO.on('studentAnswerResult', (data) => {
       fetchData.insertResult(data.teacherMail, data.studentMail, data.groupName, data.quizzTitle, data.questionNumber, data.studentAnswers, data.resultQuestion, quizzTime);
});

socketIO.on('updateStudentList', (data) => {
       data.listOfStudents.forEach((student) => {
              maClasse.updateStudentList(student.mail, student.status, data.numberOfRegisteredStudents);
       });

       maClasse.updateNumberOfConnectedStudents(data.numberOfConnectedStudents, '#numberOfConnectedStudents');
});

socketIO.on('updateSessionStatus', (data) => {
       /* sessionStatus = 'CreateSession' || 'SessionStatus' || 'DisplayQuestions' || 'SessionEnded' */
       maClasse.setCurrentSection(`#section${data.sessionStatus}`);

       if (data.sessionStatus != 'CreateSession') {
              mail = data.teacher;
              quizzName = data.quizzTitle;
              groupName = data.groupName
              maClasse.setSessionStatus(data);
       }
       if (data.sessionStatus == 'SessionStatus') {
              console.log('slt')
              document.querySelector('#infosAndNumberAnswers').classList.add('d-flex');
              document.querySelector('#infosAndNumberAnswers').style.display = "flex";

              document.querySelector('#numberOfAnswer').style.display = "none";
       }

       if (data.sessionStatus == 'DisplayQuestions') {
              document.querySelector('#infosAndNumberAnswers').classList.add('d-flex');
              document.querySelector('#infosAndNumberAnswers').style.display = "flex";
              document.querySelector('#numberOfAnswer').style.display = "block";
       }
       if (data.sessionStatus == 'DisplayResults') {
              document.querySelector('#infosAndNumberAnswers').classList.remove('d-flex');
              document.querySelector('#infosAndNumberAnswers').style.display = "none";
              document.querySelector('#numberOfAnswer').style.display = "block";

              questionsAndAnswers = data.quizzQuestionsAndAnswers[1];
              seeResults();
       }
});

socketIO.on('last question', () => {
       document.querySelector('#seeResult').style.display = "inline-block";
       document.querySelector('#nextQuestion').style.display = "none";
});

//////////////////////////////////////////////////////////////////////////////

document.querySelector('#logout').addEventListener('click', () => {
       socketIO.emit('resetSession');
});

document.querySelector('#createSessionForm').addEventListener('submit', (e) => {
       e.preventDefault();
       socketIO.emit('checkMail', mail);

       quizzName = document.querySelector('#quizzSelected').innerText;
       groupName = document.querySelector('#groupSelected').innerText;

       if (quizzName != "Selectionner un quizz" && groupName != "Selectionner un groupe" && quizzName != null && groupName != null) {
              socketIO.emit('createSession', {
                     quizzName: quizzName,
                     groupName: groupName,
                     mail: this.mail
              });
       }
});

document.querySelector('#startSession').addEventListener('click', async () => {
       
       await fetchData.fetchQuestionsAndAnswers(quizzName, mail).then(value => {
              questionsAndAnswers = value[1];
              socketIO.emit('startSession', value);
       });
       socketIO.emit('getNextQuestion');

});

document.querySelector('#nextQuestion').addEventListener('click', (e) => {
       e.preventDefault();
       socketIO.emit('getNextQuestion');
       socketIO.emit('getStudentAnswer');
});

document.querySelector('#seeResult').addEventListener('click', (e) => {
       e.preventDefault();
       socketIO.emit('seeResults');
       seeResults();
});

function seeResults() {
       let todayDate = new Date().toISOString().slice(0, 10).replace('T', ' ') + ' ' + quizzTime;

       fetchData.fetchQuizzResults(questionsAndAnswers, mail, quizzName, groupName, todayDate).then(value => {
              maClasse.displayResults(value[1], value[2], '#accordionForResults')
       });
}