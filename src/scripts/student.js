const socket = io("http://10.69.88.55:8100", { transports: ["websocket"] });

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

let studentMail;
let answers = [];
let currentQuestion = 1;
let isCurrentQuestion = true;
let quizzCurrentQuestion = null;

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
                     currentQuestionNumber.innerHTML = `Numéro de la question : 1`;
              });

              socket.on('getStudentAnswer', (jsonContainNumberQuestion, callback) => {
                     quizzCurrentQuestion = jsonContainNumberQuestion['numberQuestion'];
                     callback({
                            answers: getAnswers(jsonContainNumberQuestion['numberQuestion'] - 1),
                            studentMail: studentMail
                     });
                     isCurrentQuestion = true;
                     currentQuestion = jsonContainNumberQuestion['numberQuestion'];

                     currentQuestionNumber.innerHTML = `Numéro de la question : ${jsonContainNumberQuestion['numberQuestion']}`;
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
       });

       socket.on('doublons', () => {
       });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

formulaireMail.addEventListener('submit', (e) => {
       e.preventDefault();
       let inputMail = document.querySelector('#mailAddress')
       studentMail = inputMail.value;
       socket.emit('studentTriesToRegister', studentMail);
       inputMail.value = "";
});

submitAnswer.addEventListener('click', () => { //bouton valider QCM
       let arrayAnswers = [];
       for (let a = 0; a < inputs.length; a++) {
              arrayAnswers.push(inputs[a].checked);
       }
       answers.some((element) => {
              if (element['questionNumber'] === currentQuestion) {
                     element['answers'] = arrayAnswers;
                     return true;
              }
       }) || answers.push({
              answers: arrayAnswers,
              questionNumber: currentQuestion
       });

       if (isCurrentQuestion) {
              socket.emit('buttonValidateClicked', true);

       } else {
              socket.emit('answerChanged', {
                     answers: getAnswers(currentQuestion),
                     studentMail: studentMail,
                     questionNumber: currentQuestion
              });
       }

       changeButtonState();
       btnAnswers.forEach((element) => {
              element.classList += " disabled";
       });
       console.log(answers)
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

document.querySelector('#previousQuestion').addEventListener('click', () => {
       if (currentQuestion > 1) {
              isCurrentQuestion = false;
              currentQuestion--;
              inputs.forEach((input, index) => {
                     input.checked = answers[currentQuestion - 1]['answers'][index];
                     if (answers[currentQuestion - 1]['answers'][index]) {
                            btnAnswers[index].classList = "btn btn-primary p-4";
                     } else {
                            btnAnswers[index].classList = "btn btn-outline-primary p-4";
                     }

              });
              currentQuestionNumber.innerHTML = currentQuestion;
              btnAnswers.forEach((button, index) => {
                     button.classList.add("disabled");
              });
              submitAnswer.hidden = true;
              btnModify.hidden = false;
       }
})

document.querySelector('#nextQuestion').addEventListener('click', () => {
       if (currentQuestion < quizzCurrentQuestion) {
              currentQuestion++;
              inputs.forEach((input, index) => {
                     if (answers[currentQuestion - 1] != undefined) {
                            input.checked = answers[currentQuestion - 1]['answers'][index];
                            if (answers[currentQuestion - 1]['answers'][index]) {
                                   btnAnswers[index].classList = "btn btn-primary p-4";
                            } else {
                                   btnAnswers[index].classList = "btn btn-outline-primary p-4";
                            }
                     } else {
                            input.checked = false;
                            btnAnswers[index].classList = "btn btn-outline-primary p-4";
                     }

              });
              currentQuestionNumber.innerHTML = `Numéro de la question : ${currentQuestion}`;
              console.log(currentQuestion, quizzCurrentQuestion)
              if (quizzCurrentQuestion == currentQuestion) {
                     isCurrentQuestion = true;

                     btnAnswers.forEach((button, index) => {
                            button.classList.remove("disabled");
                     });
                     submitAnswer.hidden = false;
                     btnModify.hidden = true;
              } else {
                     btnAnswers.forEach((button, index) => {
                            button.classList.add("disabled");
                     });
                     submitAnswer.hidden = true;
                     btnModify.hidden = false;

              }
       }
})
///////////////////////////////////////////////////////////////////////////////////////////////

function getAnswers(questionNumber) {
       if (answers[questionNumber - 1] == undefined) {
              answers[questionNumber - 1] = {
                     answers: [false, false, false, false],
                     questionNumber: questionNumber
              }
       }
       return answers[questionNumber - 1]['answers'];
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