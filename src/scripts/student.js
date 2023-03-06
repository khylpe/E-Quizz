const socket = io("http://10.191.179.176:8100", { transports: ["websocket"] });

let formulaireMail = document.querySelector('#formMail');
let divButtons = document.querySelector('#answerQuestion');
let btnReturnHome = document.querySelector('#btnHome');
let btnModify = document.querySelector('#btnModify');
let btnAnswers = document.querySelectorAll('#btnAnswers button');
let inputs = document.querySelectorAll('#btnAnswers input[type="checkbox"]');
let submitAnswer = document.querySelector('#btnValidate');
let inputMail = document.querySelector('#mailAddress');
let waitingRoomTeacher = document.querySelector('#waitTeacherConnect');
let nameStudent = document.querySelector('#nameStudent')
let waitingRoom = document.querySelector('#waiting')

changeDivState('#test');
//front  
btnAnswers.forEach((button, index) => {
       button.addEventListener('click', () => {
              if (button.classList.contains('btn-primary')) {
                     button.classList = "btn btn-outline-primary p-4";
                     inputs[index].checked = false;
              } else {
                     button.classList = "btn btn-primary p-4";
                     inputs[index].checked = true;
              }
       });
});

socket.on('connect', () => {
       changeDivState('#formMail');
       socket.on('studentRegistered', (sessionStatus) => {
              document.querySelector('#mail').innerHTML = inputMail.value;

              if (sessionStatus != 'sessionStarted') {
                     nameStudent.innerHTML = `Bienvenue ${inputMail.value}`;
                     changeDivState('#waitTeacherConnect');
                     if (sessionStatus === 'CreateSession') {
                            waitingRoom.innerHTML = "Le prof n'a pas encore créé la session";
                     }
                     else if (sessionStatus === 'SessionStatus') {
                            waitingRoom.innerHTML = "En attente d'élève supplémentaire"
                     }
              } else {
                     changeDivState('#answerQuestion');
              }

              socket.on('teacherNotConnected', () => {
                     waitingRoom.innerHTML = "Le prof n'est pas connecté";
              });

              socket.on('sessionStarted', () => {
                     changeDivState('#answerQuestion');
              });

              socket.on('getStudentAnswer', () => {
                     socket.emit('sendStudentAnswer', { answers: getAnswers() });
                     newQuestion();
              });

              socket.on('sessionUpdated', (sessionStatus) =>{ // à envoyer looooooooooooooooooooool
                     if (sessionStatus != 'sessionStarted') {
                            nameStudent.innerHTML = `Bienvenue ${inputMail.value}`;
                            changeDivState('#waitTeacherConnect');
                            if (sessionStatus === 'CreateSession') {
                                   waitingRoom.innerHTML = "Le prof n'a pas encore créé la session";
                            }
                            else if (sessionStatus === 'SessionStatus') {
                                   waitingRoom.innerHTML = "En attente d'élève supplémentaire"
                            }
                     } else {
                            changeDivState('#answerQuestion');
                     }
              });
       });

       socket.on('doublons', () => {
       });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

formulaireMail.addEventListener('submit', (e) => {
       e.preventDefault();
       let inputMail = document.querySelector('#mailAddress');
       socket.emit('studentTriesToRegister', inputMail.value);
       inputMail.value = "";
});

submitAnswer.addEventListener('click', () => { //bouton valider QCM
       changeButtonState();
       btnAnswers.forEach((element) => {
              element.classList += " disabled";
       });
       socket.emit('buttonValidateClicked', true);
});

btnModify.addEventListener('click', () => { //bouton corriger QCM
       changeButtonState();
       btnAnswers.forEach((element) => {
              element.classList.remove("disabled");
       });
       socket.emit('buttonValidateClicked', false);
});

btnReturnHome.addEventListener('click', () => { //bouton Home QCM
       socket.emit('studentDisconnect', () => {
       });
       changeDivState('#formMail');
       newQuestion();
});

/////////////////////////////////////////////////////////////////////////////////////////////////

function getAnswers() {
       let arrayAnswers = [];
       for (let a = 0; a < inputs.length; a++) {
              arrayAnswers.push(inputs[a].checked);
       }
       return arrayAnswers;
}

function changeDivState(divToDisplay) {
       document.querySelectorAll('#allParts div.part').forEach((div) => {
              div.hidden = true
              btnModify.hidden = true;
       });
       document.querySelector(divToDisplay).hidden = false;
}

function changeButtonState() {
       submitAnswer.hidden = !submitAnswer.hidden;
       btnModify.hidden = !btnModify.hidden;
}

function newQuestion() {
       inputs.forEach((input) => {
              input.checked = false;
       });

       btnAnswers.forEach((button) => {
              button.classList = "btn btn-outline-primary p-4";
              button.classList.remove("disabled");
       });

       btnModify.hidden = true;
       submitAnswer.hidden = false;
}