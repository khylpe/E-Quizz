/* Description: This file contains the javascript code for the teacher page */
mail = document.querySelector('#mail').innerText;
let maClasse = new teacher(mail);

/*     when socket is connected : fetch the list of quizz and display it by 
       passing the returned value of 'fetchQuizzList' method from FetchDataFromDB class
       to 'displayQuizzList' method from manageFront class. Do the same for the students */

maClasse.socketIO.on('connect', () => {
       maClasse.fetchData.fetchQuizzList()
              .then(value => {
                     maClasse.manageFront.displayQuizzList(value);
              });
       maClasse.fetchData.fetchStudentGroups()
              .then(value => { maClasse.manageFront.displayStudentGroups(value) });
});

maClasse.socketIO.on('sessionStatus', (data) => {
       if (data.sessionStatus != 'notConnected') {
              if(maClasse.mail != data.teacher){
                     maClasse.manageFront.tempMessage('error', 'Une autre session est en cours');
                     maClasse.manageFront.changeCurrentSection('sectionCreateSession');
              maClasse.resetSession();
                     return;
              }
              
              maClasse.manageFront.changeCurrentSection(`section${data.sessionStatus}`);
              if(data.sessionStatus == 'SessionStatus'){
                     maClasse.manageFront.updateSessionInformations(data);
              }
       }
});

document.querySelector('#createSessionForm').addEventListener('submit', (e) => {
       e.preventDefault();
       let quizzName = document.querySelector('#quizzSelected').innerText;
       let groupName = document.querySelector('#groupSelected').innerText;
       maClasse.createSession(quizzName, groupName);
});

maClasse.socketIO.on('sessionCreated', (data) => {
       maClasse.manageFront.tempMessage('success', `session créée, les étudiants peuvent maintenant se connecter.  <br> Titre du quizz : ${data.quizzName} <br> Groupe : ${data.groupName}`);
       maClasse.manageFront.changeCurrentSection('sectionSessionStatus');
});

document.querySelector('#startSession').addEventListener('click', () => {
       maClasse.fetchData.fetchQuestionsAndAnswers('Quizz de teste 1', 'crahe.arthur@gmail.com').then(value => {
              console.log(value);
})});