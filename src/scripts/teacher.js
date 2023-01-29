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

let quizzName;
let groupName;

socketIO = io('http://10.191.179.176:8100', { transports: ["websocket"] });

socketIO.on('connect', () => {
       socketIO.emit('checkMail', mail);

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
       maClasse.changeCurrentSection(`section${data.sessionStatus}`);

       if (data.sessionStatus != 'CreateSession') {
              mail = data.teacher;
              quizzName = data.quizzTitle;
              maClasse.updateSessionStatus(data);
       }
});

socketIO.on('anotherTeacherConnected', (data) => {
       maClasse.tempMessage('error', `Un autre professeur est connecté. <br>`, '#tempMessage');
       maClasse.changeCurrentSection('sectionCreateSession');
       buttonDisplayQuizzList = document.querySelector('#buttonDisplayQuizzList');
       buttonDisplayQuizzList.classList.add('disabled');
       buttonDisplayStudentGroup = document.querySelector('#dropdownButtonStudentGroup');
       buttonDisplayStudentGroup.classList.add('disabled');
       buttonCreateSession = document.querySelector('#submitCreateSession');
       buttonCreateSession.classList.add('disabled');

});

//////////////////////////////////////////////////////////////////////////////

document.querySelector('#createSessionForm').addEventListener('submit', (e) => {
       socketIO.emit('checkMail', mail);

       e.preventDefault();
       quizzName = document.querySelector('#quizzSelected').innerText;
       groupName = document.querySelector('#groupSelected').innerText;

       console.log(this.mail)

       if (quizzName != "Selectionner un quizz" && groupName != "Selectionner un groupe" && quizzName != null && groupName != null) {
              socketIO.emit('createSession', { quizzName: quizzName, groupName: groupName, mail: this.mail });
       }
});

document.querySelector('#startSession').addEventListener('click', () => {
       fetchData.fetchQuestionsAndAnswers(quizzName, mail).then(value => {
              socketIO.emit('startSession', value);
       });
});

document.querySelector('#nextQuestion').addEventListener('click', (e) => {
       e.preventDefault();
       socketIO.emit('getNextQuestion');

})