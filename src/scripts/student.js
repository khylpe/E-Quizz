const socket = io("http://192.168.0.254:8100", {
       transports:
              ["websocket"],
       query: {
              status: 'student'
       }
});

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
let answers = [];
let currentQuestion = 1;
let isCurrentQuestion = true;
let quizzCurrentQuestion = null;
user.hidden = true;
answerQuestion.hidden = true;

changeDivState('#test');

socket.on('teacherNotConnected', () => {
       waitingRoom.innerHTML = "Le prof n'est pas connecté";
});

socket.on('informationSession', (data) => {
              // document.querySelector('#nameOfQuizz').innerHTML = `Nom du quizz : ${data.quizzTitle}`;
       document.querySelector('#nameOfTeacher').innerHTML = `Nom du professeur : ${data.teacherMail}`;
       document.querySelector('#statusSessionWaitRoom').innerHTML = `Nom du quizz : ${data.quizzTitle}`;
       document.querySelector('#numberOfStudentRegistered').innerHTML = `Nombre d'élèves enregistrés : ${data.numberOfRegisteredStudents}`;
       document.querySelector('#nameOfGroup').innerHTML = `Nom du groupe : ${data.groupName}`;
       


});

socket.on('test', (dat) => {
       console.log(dat);
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
              nameStudent.innerHTML = `Bonjour ${studentMail}`;
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
       timerReturnHome();

});
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

       formulaireMail.addEventListener('submit', (e) => {
              e.preventDefault();
              let inputMail = document.querySelector('#mailAddress')
              studentMail = inputMail.value;
              socket.emit('studentTriesToRegister', studentMail, (response) => {
                     console.log(response);
                     if (response.status == "accepted") {
                            user.hidden = false;
                            document.querySelector('#mail').innerHTML = studentMail;

                            if (response.sessionStatus != 'sessionStarted') {
                                   nameStudent.innerHTML = `Bonjour ${studentMail}`;
                                   
                                   changeDivState('#waitTeacherConnect');
                                   if (response.sessionStatus === 'CreateSession') {
                                          waitingRoom.innerHTML = "Le prof n'a pas encore créé la session";
                                   }
                                   else if (response.sessionStatus === 'SessionStatus') {
                                          waitingRoom.innerHTML = "En attente d'élève supplémentaire";                                         
                                   }
                            } else {
                                   changeDivState('#answerQuestion');
                            }                           

                     } else if (response.status == "doublons") {
                            formulaireMail.innerHTML = "DOUBLONS";
                     }
              });

              studentMail = inputMail.value;
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
              returnHome();

       });
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
});

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
});
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

function returnHome() {
       changeDivState('#formMail');
       newQuestion();
       modal.style.display = "none";
}

function timerReturnHome() {  ///// A TESTER
       let monTimer = setTimeout(returnHome(), 3000);
       clearTimeout(monTimer);
}