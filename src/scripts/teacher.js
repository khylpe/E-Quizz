/* Description: This file contains the javascript code for the teacher page */
document.querySelector('#studentListTitle').innerHTML = `Liste des étudiants enregistrés`;
document.querySelector('#studentList').style.minHeight = document.querySelector('#numberOfConnectedStudents').offsetHeight + "px";
document.querySelector('#sectionSessionStatus').style.display = "none";
document.querySelector('#tempMessage').style.display = "none";
document.querySelector('#sessionInfo').style.display = "none";
document.querySelector('#sectionDisplayQuestions').style.display = "none";


mail = document.querySelector('#mail').innerText; // attention
let maClasse = new teacher(mail);
let fetchData = new FetchDataFromDB(mail);

let quizzName;
let groupName;

socketIO = io('http://10.69.88.32:8100', { transports: ["websocket"] });


socketIO.on('connect', () => {
       /* if checkMail event returns anotherTeacherConnected event, all events are being removed */
       socketIO.emit('checkMail', mail);

       socketIO.on('anotherTeacherConnected', (data) => {
              maClasse.tempMessage('error', `Un autre professeur est connecté. <br>`, '#tempMessage');
              maClasse.changeCurrentSection('sectionCreateSession');

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

       socketIO.on('teacherConnected', (data) => {
              fetchData.fetchQuizzList()
                     .then(value => {
                            let liListe = maClasse.displayQuizzList(value, '#quizzList');
                            if (liListe) {
                                   liListe.forEach((nameInList) => {
                                          nameInList.addEventListener('click', () => {
                                                 document.querySelector('#dropdownButtonStudentGroup').classList.remove('disabled');
                                                 document.querySelector('#quizzSelected').innerHTML = nameInList.innerHTML;
                                          });
                                   });
                            };
                     });
              fetchData.fetchStudentGroups()
                     .then(value => {
                            let liList = maClasse.displayStudentGroups(value, '#groupsList');
                            if (liList) {
                                   liList.forEach((groupInList) => {
                                          groupInList.addEventListener('click', () => {
                                                 document.querySelector('#groupSelected').innerHTML = groupInList.innerHTML;
                                                 document.querySelector('#submitCreateSession').classList.remove('disabled');
                                          });
                                   });
                            }
                     });

              socketIO.on('sessionStatusChanged', (data) => {
                     maClasse.changeCurrentSection(`section${data}`);
              });

              socketIO.on('sessionCreated', (data) => {
                     maClasse.tempMessage('success',
                            `session créée, les étudiants peuvent maintenant se connecter.  <br> Titre du quizz : ${data.quizzName} <br> Groupe : ${data.groupName}`,
                            '#tempMessage');
                     maClasse.changeCurrentSection('sectionSessionStatus');
              });

              socketIO.on('numberOfConnectedStudentChanged', (number) => {
                     maClasse.updateNumberOfConnectedStudents(number, '#numberOfConnectedStudents');
              });

              socketIO.on('studentRegisteredChanged', (data) => {
                     let studentMail = data.mail;
                     let status = data.status;
                     let numberOfRegisteredStudents = data.numberOfRegisteredStudents;

                     maClasse.updateStudentList(studentMail, status, numberOfRegisteredStudents);
              });

              socketIO.on('sessionStarted', (data) => {
                     maClasse.changeCurrentSection('sectionDisplayQuestions');
                     maClasse.tempMessage('success', 'La session a été démarrée', '#tempMessage');
                     console.log('sending getNextQuestion signal');
                     socketIO.emit('getNextQuestion');
              });

              socketIO.on('nextQuestion', (data) => {
                     let question, answers, questionNumber, numberOfQuestions;
                     if (data) {
                            question = data.currentQuestion;
                            answers = data.currentAnswers;
                            questionNumber = data.currentQuestionNumber;
                            numberOfQuestions = data.numberOfQuestions;
                            maClasse.displayQuestion(question, answers, questionNumber, numberOfQuestions, '#question', '#possibleAnswers');
                     }
              });

              socketIO.on('updateSessionStatus', (data) => {
                     /* sessionStatus = 'CreateSession' || 'SessionStatus' || 'DisplayQuestions' || 'SessionEnded' */

                     maClasse.changeCurrentSection(`section${data.sessionStatus}`);

                     if (data.sessionStatus != 'CreateSession') {
                            mail = data.teacher;
                            quizzName = data.quizzTitle;
                            maClasse.updateSessionStatus(data);
                     }
              });

              socketIO.on('studentAnswers', (data) => {
                     console.log(data);
              });

              socketIO.on('updateStudentList', (data) => {
                     console.log('tfiyguhjik');
                     let studentList = data.listOfStudents;
                     studentList.forEach((student) => {
                            maClasse.updateStudentList(student.mail, student.status, data.numberOfRegisteredStudents);
                     });

                     maClasse.updateNumberOfConnectedStudents(data.numberOfConnectedStudents, '#numberOfConnectedStudents');
              });
       });
});

//////////////////////////////////////////////////////////////////////////////
document.querySelector('#logout').addEventListener('click', () => {
       console.log('logout');
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

document.querySelector('#startSession').addEventListener('click', () => {
       console.log(quizzName);
       fetchData.fetchQuestionsAndAnswers(quizzName, mail).then(value => {
       let i = 1;
       while(i==1){
              socketIO.emit('startSession', value);
              console.log(value);
              i++;
       }
       });
});

document.querySelector('#nextQuestion').addEventListener('click', (e) => {
       e.preventDefault();
       socketIO.emit('getNextQuestion');
       socketIO.emit('getStudentAnswers');
})