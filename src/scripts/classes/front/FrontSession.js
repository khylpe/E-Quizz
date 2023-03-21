import FrontGlobal from "./FrontGlobal.js";

export default class Teacher extends FrontGlobal {
       constructor() {
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
              document.querySelector(selectorForAnswers).innerHTML = "";

              if (!question.includes("?") && !question.includes(" ?")) {
                     document.querySelector(selectorForQuestion).innerHTML = question + ` ? (${questionNumber}/${numberOfQuestions})`;
              } else {
                     document.querySelector(selectorForQuestion).innerHTML = question + ` (${questionNumber}/${numberOfQuestions})`;
              }

              let firstDiv = document.createElement('div');
              firstDiv.classList = "d-flex flex-column";
              document.querySelector(selectorForAnswers).appendChild(firstDiv);

              let secondDiv = document.createElement('div');
              secondDiv.classList = 'list-group d-flex flex-row justify-content-evenly align-items-center';
              firstDiv.appendChild(secondDiv);

              let firstAnswer = document.createElement('p');
              firstAnswer.classList = 'list-group-item border rounded-end rounded-start border-primary-subtle';

              let firstAnswerLetter = document.createElement('span');
              firstAnswerLetter.classList = `text-primary`;
              firstAnswerLetter.innerText = `A. `;

              let firstAnswerSpan = document.createElement('span');
              firstAnswerSpan.innerText = `${answers[0]}`;
              firstAnswer.appendChild(firstAnswerSpan);

              firstAnswer.appendChild(firstAnswerLetter);
              firstAnswer.appendChild(firstAnswerSpan);


              secondDiv.appendChild(firstAnswer);

              let secondAnswer = document.createElement('p');
              secondAnswer.classList = 'list-group-item border rounded-end rounded-start border-primary-subtle';

              let secondAnswerLetter = document.createElement('span');
              secondAnswerLetter.classList = `text-primary`;
              secondAnswerLetter.innerText = `B. `;

              let secondAnswerSpan = document.createElement('span');
              secondAnswerSpan.innerText = `${answers[1]}`;
              secondAnswer.appendChild(secondAnswerSpan);

              secondAnswer.appendChild(secondAnswerLetter);
              secondAnswer.appendChild(secondAnswerSpan);

              secondDiv.appendChild(secondAnswer);



              if (answers.length > 2 && answers[2] != "") {
                     let thirdDiv = document.createElement('div');
                     thirdDiv.classList = 'list-group d-flex flex-row justify-content-evenly align-items-center';
                     firstDiv.appendChild(thirdDiv);

                     let thirdAnswer = document.createElement('p');
                     thirdAnswer.classList = 'list-group-item border rounded-end rounded-start border-primary-subtle';


                     let thirdAnswerLetter = document.createElement('span');
                     thirdAnswerLetter.classList = `text-primary`;
                     thirdAnswerLetter.innerText = `C. `;

                     let thirdAnswerSpan = document.createElement('span');
                     thirdAnswerSpan.innerText = `${answers[2]}`;
                     thirdAnswer.appendChild(thirdAnswerSpan);

                     thirdAnswer.appendChild(thirdAnswerLetter);
                     thirdAnswer.appendChild(thirdAnswerSpan);

                     thirdDiv.appendChild(thirdAnswer);
                     if (answers.length == 4 && answers[3] != "") {
                            let fourthAnswer = document.createElement('p');
                            fourthAnswer.classList = 'list-group-item border rounded-end rounded-start border-primary-subtle';

                            let fourthAnswerLetter = document.createElement('span');
                            fourthAnswerLetter.classList = `text-primary`;
                            fourthAnswerLetter.innerText = `D. `;

                            let fourthAnswerSpan = document.createElement('span');
                            fourthAnswerSpan.innerText = `${answers[3]}`;
                            fourthAnswer.appendChild(fourthAnswerSpan);

                            fourthAnswer.appendChild(fourthAnswerLetter);
                            fourthAnswer.appendChild(fourthAnswerSpan);

                            thirdDiv.appendChild(fourthAnswer);
                     }
              }
       }
}