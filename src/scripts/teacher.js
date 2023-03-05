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

let teacherClass = new Teacher();
let fetchData = new DB(mail);

socketIO = io('http://10.191.179.176:8100', { transports: ["websocket"] });

let quizzName;
let questionsAndAnswers;


socketIO.on('connect', () => {
       /* if checkMail event returns anotherTeacherConnected event, all events are being removed */
       socketIO.emit('checkMail', mail);

       socketIO.on('anotherTeacherConnected', (data) => {
              teacherClass.tempMessage('error', `Un autre professeur est connecté. <br>`, '#tempMessage');
              teacherClass.setCurrentSection('#sectionCreateSession');

              /* disable buttons */
              buttonDisplayQuizzList = document.querySelector('#buttonDisplayQuizzList');
              buttonDisplayQuizzList.classList.add('disabled');
              buttonDisplayStudentGroup = document.querySelector('#dropdownButtonStudentGroup');
              buttonDisplayStudentGroup.classList.add('disabled');
              buttonCreateSession = document.querySelector('#submitCreateSession');
              buttonCreateSession.classList.add('disabled');

              socketIO.on('teacherNotConnectedAnymore', (data) => {
                     teacherClass.tempMessage('success', `Vous pouvez desormais vous connecter`, '#tempMessage');
                     buttonDisplayQuizzList.classList.remove('disabled');
                     buttonDisplayStudentGroup.classList.remove('disabled');
                     buttonCreateSession.classList.remove('disabled');
              });
       });

       socketIO.on('teacherConnected', async () => { /* event triggered when the teacher is connected. Sent by the server */
              await fetchData.fetchQuizzList()
                     .then(value => {     /*     [0] = error || success,
                                                 [1] = quizzListTitles[] || error message
                                          */

                            if (value[0] != "success") {
                                   teacherClass.tempMessage('error', value[1], '#tempMessage'); /* display error message */
                                   return ;
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
                                   return ;
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
       });
});

socketIO.on('numberOfConnectedStudentChanged', (number) => {
       teacherClass.updateNumberOfConnectedStudents(number, '#numberOfConnectedStudents');
});

socketIO.on('sessionStarted', (time) => {
       teacherClass.setCurrentSection('#sectionDisplayQuestions');
       teacherClass.tempMessage('success', 'La session a été démarrée', '#tempMessage');
       fetchData.setQuizzTime(time);
});

socketIO.on('nextQuestion', (data) => {
       document.querySelector('#numberOfAnswerSent').innerHTML = 0;

       let question, answers, questionNumber, numberOfQuestions;
       if (data) {
              question = data.currentQuestion;
              answers = data.currentAnswers;
              questionNumber = data.currentQuestionNumber;
              numberOfQuestions = data.numberOfQuestions;
              teacherClass.displayQuestion(question, answers, questionNumber, numberOfQuestions, '#question', '#possibleAnswers');
       }
});

socketIO.on('numberOfAnswersChanged', (numberOfAnswer) => {
       document.querySelector('#numberOfAnswerSent').innerHTML = numberOfAnswer;
});

socketIO.on('studentAnswerResult', async (data) => {
       await fetchData.insertResult(data.studentMail, data.questionNumber, data.studentAnswers, data.resultQuestion);
});

socketIO.on('updateStudentList', (data) => {
       data.listOfStudents.forEach((student) => {
              teacherClass.updateStudentList(student.mail, student.status, data.numberOfRegisteredStudents);
       });

       teacherClass.updateNumberOfConnectedStudents(data.numberOfConnectedStudents, '#numberOfConnectedStudents');
});

socketIO.on('updateSessionStatus', (data) => {
       /* sessionStatus = 'CreateSession' || 'SessionStatus' || 'DisplayQuestions' || 'SessionEnded' */
       teacherClass.setCurrentSection(`#section${data.sessionStatus}`);

       if (data.sessionStatus != 'CreateSession') {
              mail = data.teacher;
              fetchData.setGroupName(data.groupName);
              fetchData.setQuizzName(data.quizzTitle);

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

socketIO.on('message', (type, message) => {
       teacherClass.tempMessage(type, message, '#tempMessage');
});

//////////////////////////////////////////////////////////////////////////////

document.querySelector('#logout').addEventListener('click', () => {
       socketIO.emit('resetSession');
});

document.querySelector('#createSessionForm').addEventListener('submit', (e) => {
       e.preventDefault();
       socketIO.emit('checkMail', mail);

       fetchData.setGroupName(document.querySelector('#groupSelected').innerText);
       fetchData.setQuizzName(document.querySelector('#quizzSelected').innerText);

       console.log('this.mail : ', this.mail);
       socketIO.emit('createSession', {
              quizzName: fetchData.quizzName,
              groupName: fetchData.groupName,
              mail: this.mail
       });
});

document.querySelector('#startSession').addEventListener('click', async () => {

       await fetchData.fetchQuestionsAndAnswers().then(value => {
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
       socketIO.emit('getStudentAnswer');
       socketIO.emit('seeResults');
});

function seeResults() {
       fetchData.fetchQuizzResults(questionsAndAnswers).then(value => {
              console.log(value)
              teacherClass.displayResults(value[1], value[2], '#accordionForResults')
       });

}