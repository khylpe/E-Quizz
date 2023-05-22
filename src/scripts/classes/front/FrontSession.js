import FrontGlobal from "./FrontGlobal.js";

export default class Teacher extends FrontGlobal {
       constructor() {
              super();
       }
       
       setSessionStatus(sessionInformation) {
              if (this.getCurrentSection().id == "sectionCreateSession") {
                     document.querySelector('#sessionInfo').style.display = "none";
                     return;
              }
              document.querySelector('#sessionInfo').style.display = "block";
              let status;
              if (sessionInformation.sessionStatus == "CreateSession")
                     status = "Pas connecté";
              else if (sessionInformation.sessionStatus == "SessionStatus")
                     status = "Session créée, en attente de démarrage";
              else if (sessionInformation.sessionStatus == "DisplayQuestions")
                     status = "Session démarrée";
              else if (sessionInformation.sessionStatus == "SessionEnded")
                     status = "Session terminée";
              else if (sessionInformation.sessionStatus == "SessionClosed")
                     status = "Session fermée";
              else
                     status = "Session inconnue";

              document.querySelector('#sessionStatusInfo').innerHTML = `Status de la session : ${status}`;
              document.querySelector('#teacherInfo').innerHTML = `Enseignant : ${sessionInformation.teacher}`;
              document.querySelector('#quizzInfo').innerHTML = `Quizz : ${sessionInformation.quizzTitle}`;
              document.querySelector('#groupInfo').innerHTML = `Groupe : ${sessionInformation.groupName}`;
       }

       setStudentList(studentName, status, numberOfRegisteredStudents) {
              document.querySelector('#studentListTitle').innerHTML = `Liste des étudiants prêts et enregistrés (${numberOfRegisteredStudents})`;

              if (status == "not registered anymore") {
                     if (!document.querySelector(`[value="${studentName}"]`)) {
                            let ul = document.getElementById("studentList");
                            let li = document.createElement("li");
                            li.setAttribute("value", `${studentName}`);

                            li.classList = "list-group-item list-group-item-action list-group-item-warning d-flex justify-content-center align-items-start";
                            let div = document.createElement("div");
                            div.classList = "ms-2";
                            div.setAttribute("id", "studentName");
                            div.appendChild(document.createTextNode(studentName));
                            li.appendChild(div);
                            ul.appendChild(li);
                     } else {
                            document.querySelector(`[value="${studentName}"]`).classList = "list-group-item list-group-item-action list-group-item-warning d-flex justify-content-center align-items-start";
                     }
              }
              else if (!document.querySelector(`[value="${studentName}"]`)) {
                     let ul = document.getElementById("studentList");
                     let li = document.createElement("li");
                     li.setAttribute("value", `${studentName}`);

                     if (status == "registered") {
                            li.classList = "list-group-item list-group-item-action list-group-item-success d-flex justify-content-center align-items-start";

                     } else if (status == "not registered") {
                            li.classList = "list-group-item list-group-item-action list-group-item-danger d-flex justify-content-center align-items-start";
                     } else {
                            li.classList = "list-group-item list-group-item-action list-group-item-warning d-flex justify-content-center align-items-start";
                     }
                     let div = document.createElement("div");
                     div.classList = "ms-2";
                     div.setAttribute("id", "studentName");
                     div.appendChild(document.createTextNode(studentName));
                     li.appendChild(div);
                     ul.appendChild(li);
              }
              else if (status == "registered") {
                     document.querySelector(`[value="${studentName}"]`).classList = "list-group-item list-group-item-action list-group-item-success d-flex justify-content-center align-items-start";
              }
       }

       setNumberOfConnectedStudents(numberOfConnectedStudents, selector) {
              document.querySelector(selector).innerHTML = numberOfConnectedStudents;
       }

       setQuestion(question, answers, questionNumber, numberOfQuestions, selectorForQuestion, selectorForAnswers) {
              
              answers.forEach((answer, index) => {
                     if (answer == "" || answer == " " || answer == null || answer == undefined) {
                            answers.splice(index, 1);
                     }
              });
       
              document.querySelector(selectorForAnswers).innerHTML = "";

              if (!question.includes("?") && !question.includes(" ?")) {
                     document.querySelector(selectorForQuestion).innerHTML = question + ` ? (${questionNumber}/${numberOfQuestions})`;
              } else {
                     document.querySelector(selectorForQuestion).innerHTML = question + ` (${questionNumber}/${numberOfQuestions})`;
              }


              let divContainingAnswers = document.createElement('div');
              divContainingAnswers.classList = "d-flex flex-column justify-content-center align-items-start";
              document.querySelector(selectorForAnswers).appendChild(divContainingAnswers);

              answers.forEach((answer, index) => {
                     let answerP = document.createElement('p');
                     answerP.classList = 'list-group-item border rounded-end rounded-start border-primary-subtle';

                     let answerLetter = document.createElement('span');
                     answerLetter.classList = `fs-1 text-info`;
                     answerLetter.innerText = `${String.fromCharCode(65 + index)}. `;
                     answerP.appendChild(answerLetter);

                     let answerSpan = document.createElement('span');
                     answerSpan.classList = `fs-1`;
                     answerSpan.innerText = `${answer}`;
                     answerP.appendChild(answerSpan);

                     divContainingAnswers.appendChild(answerP);
              });              
       }
}