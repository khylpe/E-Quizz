const socket = io("http://10.69.88.32:8100", { transports: ["websocket"] });

let formulaireMail = document.querySelector('#formMail');
let divButtons = document.querySelector('#answerQuestion');
let btnModify = document.querySelector('#btnModify');
let btnAnswers = document.querySelectorAll('#btnAnswers button');
let inputs = document.querySelectorAll('#btnAnswers input[type="checkbox"]');
let submitAnswer = document.querySelector('#btnValidate');
let inputMail = document.querySelector('#mailAddress');
let waitingRoomTeacher = document.querySelector('#waitTeacherConnect');
let nameStudent = document.querySelector('#nameStudent');
let waitingRoom = document.querySelector('#waiting');
let messageEndQuizz = document.querySelector('#End');
let currentQuestionNumber = document.querySelector('#numberQuestion');
let modal = document.querySelector('#ModalDeconnexion');
let logout = document.querySelector('#deco');
let btnModalConfirmer = document.querySelector('#modalButtonConfirm');
let user = document.querySelector('#user');

let studentMail = null;

user.hidden = true;
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
       
       /////////////////////////////////////////////////////////////////////////////////////////////////////////

       formulaireMail.addEventListener('submit', (e) => {
              e.preventDefault();
              let inputMail = document.querySelector('#mailAddress')
              studentMail = inputMail.value;
              socket.emit('studentTriesToRegister', studentMail, (response) => {
                     console.log(response)
                     if (response.status == "accepted") {
                            user.hidden = false;
                            document.querySelector('#mail').innerHTML = `Mail: ${studentMail}`;

                            if (response.sessionStatus != 'sessionStarted') {
                                   nameStudent.innerHTML = `Bienvenue ${studentMail}`;
                                   changeDivState('#waitTeacherConnect');
                                   if (response.sessionStatus === 'CreateSession') {
                                          waitingRoom.innerHTML = "Le prof n'a pas encore créé la session";
                                   }
                                   else if (response.sessionStatus === 'SessionStatus') {
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
                                   currentQuestionNumber.innerHTML = "1";
                            });

                            socket.on('getStudentAnswer', (jsonContainNumberQuestion, callback) => {
                                   callback({
                                          answers: getAnswers(),
                                          studentMail: studentMail
                                   });
                                   currentQuestionNumber.innerHTML = jsonContainNumberQuestion['numberQuestion'];
                                   console.log(jsonContainNumberQuestion['numberQuestion']);
                                   newQuestion();
                            });

                            socket.on('sessionUpdated', (sessionStatus) => {
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

                            socket.on('endOfQuizzTeacher', () => {
                                   changeDivState('#endOfQuizz');
                                   messageEndQuizz.innerHTML = "fin";

                            });

                     }else if(response.status == "doublons"){
                            
                            document.body.innerHTML = "DOUBLONS";
                     }
              });

              studentMail = inputMail.value;
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

       btnModalConfirmer.addEventListener('click', () => {
              socket.emit('studentDisconnect', () => {
              });
              changeDivState('#formMail');
              newQuestion();
              modal.style.display = "none";

       });
});
///////////////////////////////////////////////////////////////////////////////////////////////

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
       currentQuestionNumber.hidden = false;
}