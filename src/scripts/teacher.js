/* Description: This file contains the javascript code for the teacher page */
document.querySelector('#studentListTitle').innerHTML = `Liste des étudiants enregistrés`;
document.querySelector('#studentList').style.minHeight = document.querySelector('#connectedStudents').offsetHeight + "px";
document.querySelector('#sectionSessionStatus').style.display = "none";
document.querySelector('#tempMessage').style.display = "none";
document.querySelector('#sessionInfo').style.display = "none";
document.querySelector('#sectionDisplayQuestions').style.display = "none";


mail = document.querySelector('#mail').innerText; // attention
let maClasse = new teacher(mail);
let fetchData = new FetchDataFromDB(mail);

socketIO = io('http://10.69.88.32:8100/', { transports: ["websocket"] });

socketIO.on('connect', () => {
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
});

socketIO.on('sessionStatus', (data) => {
       console.log(data);
       if (data.sessionStatus != 'notConnected') {
              if (maClasse.mail != data.teacher) {
                     maClasse.tempMessage('error', 'Une autre session est en cours', '#tempMessage');
                     maClasse.changeCurrentSection('sectionCreateSession');
                     this.socketIO.emit('resetSession');
                     return;
              }

              maClasse.changeCurrentSection(`section${data.sessionStatus}`);
              if(data.sessionStatus == 'SessionStatus' || data.sessionStatus == 'DisplayQuestions'){
                     maClasse.updateSessionInformations(data);
              }
              if (data.sessionStatus == 'SessionStatus') {
                     data.listOfRegisteredStudents.forEach((student) => {
                            maClasse.updateStudentList(student.mail, student.status, data.numberOfRegisteredStudents);
                     });
              }
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

socketIO.on('numberOfConnectedStudentChanged', (data) => {
       // maClasse.updateConnectedStudents(data);
       document.querySelector('#connectedStudents').innerHTML = data;

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
       socketIO.emit('getNextQuestion');
});

socketIO.on('nextQuestion', (data) => {
       console.log(data);
       let question, answers, questionNumber, numberOfQuestions;
       if (data) {
              question = data.question;
              answers = data.answers;
              questionNumber = data.questionNumber;
              numberOfQuestions = data.numberOfQuestions; 
              maClasse.displayQuestion(question, answers, questionNumber, numberOfQuestions, '#question', '#possibleAnswers');
       }
});

//////////////////////////////////////////////////////////////////////////////

document.querySelector('#createSessionForm').addEventListener('submit', (e) => {
       e.preventDefault();
       console.log('sessions should be created');
       let quizzName = document.querySelector('#quizzSelected').innerText;
       let groupName = document.querySelector('#groupSelected').innerText;

       if (quizzName != "Selectionner un quizz" && groupName != "Selectionner un groupe" && quizzName != null && groupName != null) {
              socketIO.emit('createSession', { quizzName: quizzName, groupName: groupName, mail: this.mail });
       }
});

document.querySelector('#startSession').addEventListener('click', () => {
       fetchData.fetchQuestionsAndAnswers('Quizz de teste 1', 'crahe.arthur@gmail.com').then(value => {
              console.log(value);
              socketIO.emit('startSession', value);

       });

});

document.querySelector('#nextQuestion').addEventListener('click', (e) => {
       e.preventDefault();
       socketIO.emit('getNextQuestion');

})