class teacher {
       constructor(mail) {
              this.mail = mail;
       }
       tempMessage(type, message, selector) { // type = "error" or "success"
              if (!message) return;
              if (type == "error") {
                     type = "alert alert-danger";
              } else if (type == "success") {
                     type = "alert alert-success";
              } else {
                     return;
              }

              let tempMessagee = document.querySelector(selector);
              tempMessagee.innerHTML = message;
              tempMessagee.classList = 'text-center container ' + type;
              tempMessagee.style.display = "block";
              setTimeout(() => {
                     tempMessagee.style.display = "none";
              }, 18000);
       }

       displayQuizzList(data, selector) { /* [0] = error or success, [1] = quizzListTitles[] || error message */
              if (data[0] == "error") {
                     this.tempMessage('error', data[1], '#tempMessage');
                     return false;
              } else if (data[0] == "success" && data[1].length > 0) {
                     let quizzList = document.querySelector(selector);
                     quizzList.innerHTML = "";
                     data[1].forEach((quizzName) => {
                            let li = document.createElement('li');
                            quizzList.appendChild(li);
                            let span = document.createElement('span');
                            span.classList = "dropdown-item";
                            span.id = "quizzInList";
                            span.innerHTML = quizzName;
                            li.appendChild(span);
                            let hr = document.createElement('hr');
                            hr.classList = "dropdown-divider quizzNameDivider";
                            quizzList.appendChild(hr);
                     });

                     // Remove the last divider // https://stackoverflow.com/a/5684878/19601188
                     var nodes = quizzList.querySelectorAll('.quizzNameDivider');
                     var last = nodes[nodes.length - 1];
                     quizzList.removeChild(last);
                     return document.querySelectorAll('#quizzInList');
              } else {
                     this.tempMessage('error', "Il n'y a pas de quizz enregistré");
                     return false;
              }
       }

       displayStudentGroups(data, selector) { /* [0] = error or success, [1] = studentGroups[] || error message */
              if (data[0] == "error") {
                     this.tempMessage('error', data[1], '#tempMessage');
                     return false;
              }
              else if (data[0] == "success" && data[1].length > 0) {
                     let groupsList = document.querySelector(selector);

                     data[1].forEach((groupName) => {
                            let li = document.createElement('li');
                            groupsList.appendChild(li);
                            let span = document.createElement('span');
                            span.classList = "dropdown-item";
                            span.id = "groupInList";
                            span.innerHTML = groupName;
                            li.appendChild(span);
                            let hr = document.createElement('hr');
                            hr.classList = "dropdown-divider groupsNameDivider";
                            groupsList.appendChild(hr);
                     });

                     // Remove the last divider // https://stackoverflow.com/a/5684878/19601188
                     var nodes = groupsList.querySelectorAll('.groupsNameDivider');
                     var last = nodes[nodes.length - 1];
                     groupsList.removeChild(last);

                     return document.querySelectorAll('#groupInList')
              }
              else {
                     this.tempMessage('error', "Il n'y a pas de groupe enregistré");
                     return false;
              }
       }

       changeCurrentSection(sectionToDisplay) {
              document.querySelectorAll('section').forEach((section) => {
                     section.style.display = "none";
              });
              document.querySelector(`#${sectionToDisplay}`).style.display = "block";
       }

       getCurrentSection() {
              return document.querySelector('section:not([style*="display: none"])'); // https://stackoverflow.com/a/39813096/19601188
       }

       updateSessionStatus(data) {
              if (this.getCurrentSection().id == "sectionCreateSession") {
                     document.querySelector('#sessionInfo').style.display = "none";
                     return;
              }
              document.querySelector('#sessionInfo').style.display = "block";
              let status;
              if (data.sessionStatus == "CreateSession")
                     status = "Pas connecté";
              else if (data.sessionStatus == "SessionStatus")
                     status = "Session créée, en attente de démarrage";
              else if (data.sessionStatus == "DisplayQuestions")
                     status = "Session démarrée";
              else if (data.sessionStatus == "SessionEnded")
                     status = "Session terminée";
              else if (data.sessionStatus == "SessionClosed")
                     status = "Session fermée";
              else
                     status = "Session inconnue";

              document.querySelector('#sessionStatusInfo').innerHTML = `Status de la session : ${status}`;
              document.querySelector('#teacherInfo').innerHTML = `Enseignant : ${data.teacher}`;
              document.querySelector('#quizzInfo').innerHTML = `Quizz : ${data.quizzTitle}`;
              document.querySelector('#groupInfo').innerHTML = `Groupe : ${data.groupName}`;
       }

       updateStudentList(studentName, status, numberOfRegisteredStudents) {
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

       updateNumberOfConnectedStudents(numberOfConnectedStudents, selector) {
              document.querySelector(selector).innerHTML = numberOfConnectedStudents;
       }

       displayQuestion(question, answers, questionNumber, numberOfQuestions, selectorForQuestion, selectorForAnswers) {
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
              firstAnswer.innerText = `A. ${answers[0]}`;
              secondDiv.appendChild(firstAnswer);

              let secondAnswer = document.createElement('p');
              secondAnswer.classList = 'list-group-item border rounded-end rounded-start border-primary-subtle';
              secondAnswer.innerText = `B. ${answers[1]}`;
              secondDiv.appendChild(secondAnswer);

              if (answers.length > 2 && answers[2] != "") {
                     let thirdDiv = document.createElement('div');
                     thirdDiv.classList = 'list-group d-flex flex-row justify-content-evenly align-items-center';
                     firstDiv.appendChild(thirdDiv);

                     let thirdAnswer = document.createElement('p');
                     thirdAnswer.classList = 'list-group-item border rounded-end rounded-start border-primary-subtle';
                     thirdAnswer.innerText = `C. ${answers[2]}`;
                     thirdDiv.appendChild(thirdAnswer);
                     if (answers.length == 4 && answers[3] != "") {
                            let fourthAnswer = document.createElement('p');
                            fourthAnswer.classList = 'list-group-item border rounded-end rounded-start border-primary-subtle';
                            fourthAnswer.innerText = `D. ${answers[3]}`;
                            thirdDiv.appendChild(fourthAnswer);
                     }
              }
       }

       /* methods for createQuizz.php */

       createAndAppendConfirmQuizzTitle(title, selector) {
              let confirmDataDiv = document.querySelector(selector);
              let confirmTitle = document.createElement('div');
              confirmTitle.classList.add('mt-5');
              confirmTitle.setAttribute('id', 'confirmTitle');
              let col = document.createElement('div');
              col.classList.add('col');
              confirmTitle.appendChild(col);
              let label = document.createElement('label');
              label.setAttribute('for', 'confirmQuizzTitle');
              label.innerHTML = 'Titre du QCM';
              col.appendChild(label);

              let div = document.createElement('div');
              div.classList.add('d-flex', 'flex-row', 'align-items-center');
              col.appendChild(div);
              let input = document.createElement('input');
              input.classList = 'form-control me-3';
              input.setAttribute('id', 'confirmQuizzTitle');
              input.setAttribute('type', 'text');
              input.setAttribute('value', title);
              input.setAttribute('disabled', 'disabled');
              div.appendChild(input);
              let i = document.createElement('i');
              i.classList = 'bi bi-pen';
              i.setAttribute('id', 'editOrConfirmTitle');
              i.style = "font-size: 2rem;";
              div.appendChild(i);
              confirmDataDiv.appendChild(confirmTitle);

              let editOrConfirmTitle = document.querySelector('#editOrConfirmTitle');

              editOrConfirmTitle.addEventListener('click', (e) => {
                     if (input.hasAttribute('disabled')) {
                            input.removeAttribute('disabled');
                            editOrConfirmTitle.classList = 'bi-check';
                            editOrConfirmTitle.style = "font-size: 2rem;";

                     } else {
                            editOrConfirmTitle.classList = 'bi-pen';
                            editOrConfirmTitle.style = "font-size: 2rem;";
                            input.setAttribute('disabled', 'disabled');
                     }
              });
       }
}