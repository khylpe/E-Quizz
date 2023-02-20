class Teacher {
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

              let tempMessageDiv = document.querySelector(selector);
              tempMessageDiv.innerHTML = message;
              tempMessageDiv.classList = 'text-center container ' + type;
              tempMessageDiv.style.display = "block";
              setTimeout(() => {
                     tempMessageDiv.style.display = "none";
              }, 18000);
       }

       displayQuizzList(data, selector) { /* [0] = error or success, [1] = quizzListTitles[] || error message */

              /* Error or success is verified before the call of this method.
                     We do not check here because if case of an error,
                     we want to display a temporary message,
                     that requires a selector (can't set a selector in the back-end) */

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

              /* Remove the last divider | https://stackoverflow.com/a/5684878/19601188 */
              var nodes = quizzList.querySelectorAll('.quizzNameDivider');
              var last = nodes[nodes.length - 1];
              quizzList.removeChild(last);
              return document.querySelectorAll('#quizzInList');
       }

       displayStudentGroups(data, selector) { /* [0] = error or success, [1] = studentGroups[] || error message */
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

       setCurrentSection(sectionToDisplay) {
              document.querySelectorAll('section').forEach((section) => {
                     section.style.display = "none";
              });
              document.querySelector(`#${sectionToDisplay}`).style.display = "block";
       }

       getCurrentSection() {
              return document.querySelector('section:not([style*="display: none"])'); // https://stackoverflow.com/a/39813096/19601188
       }

       setSessionStatus(data) {
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

       displayResults(questions, listOfStudentsWithTheirAnswers, selector) {
              document.querySelector(selector).innerHTML = "";
              let numberOfQuestions = questions.length;
              questions.forEach((question, index) => {
                     let questionDiv = document.createElement('div');
                     questionDiv.classList = 'accordion-item border border-primary-subtle questions';
                     questionDiv.setAttribute('id', `question${index + 1}`);

                     let questionHeader = document.createElement('h2');
                     questionHeader.classList = 'accordion-header';
                     questionDiv.appendChild(questionHeader);

                     let questionButton = document.createElement('button');
                     questionButton.classList = 'accordion-button collapsed';
                     questionButton.setAttribute('type', 'button');
                     questionButton.setAttribute('data-bs-toggle', 'collapse');
                     questionButton.setAttribute('data-bs-target', `#collapse${index + 1}`);
                     questionButton.setAttribute('aria-expanded', 'false');
                     questionButton.setAttribute('aria-controls', `collapse${index + 1}`);
                     questionButton.innerText = `Question ${index + 1}/${numberOfQuestions} : ${question[0]}`;
                     questionHeader.appendChild(questionButton);

                     let questionBody = document.createElement('div');
                     questionBody.classList = 'accordion-collapse collapse';
                     questionBody.setAttribute('id', `collapse${index + 1}`);
                     questionDiv.appendChild(questionBody);

                     let questionBodyDiv = document.createElement('div');
                     questionBodyDiv.classList = 'accordion-body';
                     questionBody.appendChild(questionBodyDiv);

                     let card = document.createElement('div');
                     card.classList = 'card text-center list-group';
                     questionBodyDiv.appendChild(card);

                     let questionStats = document.createElement('div');
                     card.appendChild(questionStats);

                     let row1 = document.createElement('div');
                     row1.classList = 'row';
                     questionStats.appendChild(row1);

                     let col6 = document.createElement('div');
                     col6.classList = 'col-6';
                     row1.appendChild(col6);

                     let card2 = document.createElement('div');
                     card2.classList = 'card text-center';
                     col6.appendChild(card2);

                     let cardHeader = document.createElement('h5');
                     cardHeader.classList = 'card-header';
                     cardHeader.innerText = 'Nombre de réponses';
                     card2.appendChild(cardHeader);

                     let card2Body = document.createElement('p');
                     card2Body.classList = 'card-body display-1';

                     let col6v2 = document.createElement('div');
                     col6v2.classList = 'col-6';
                     row1.appendChild(col6v2);

                     let card3 = document.createElement('div');
                     card3.classList = 'card text-center';
                     col6v2.appendChild(card3);

                     let cardHeader2 = document.createElement('h5');
                     cardHeader2.classList = 'card-header';
                     cardHeader2.innerText = 'Pourcentage de réponses';
                     card3.appendChild(cardHeader2);

                     let card3Body = document.createElement('p');
                     card3Body.classList = 'card-body display-1';

                     let row2 = document.createElement('div');
                     row2.classList = 'row mt-5';
                     questionStats.appendChild(row2);

                     let col6v3 = document.createElement('div');
                     col6v3.classList = 'col-6';
                     row2.appendChild(col6v3);

                     let card4 = document.createElement('div');
                     card4.classList = 'card text-center';
                     col6v3.appendChild(card4);

                     let cardHeader3 = document.createElement('h5');
                     cardHeader3.classList = 'card-header';
                     cardHeader3.innerText = 'Nombre de réponses correctes';
                     card4.appendChild(cardHeader3);

                     let card4Body = document.createElement('p');
                     card4Body.classList = 'card-body display-1';

                     let col6v4 = document.createElement('div');
                     col6v4.classList = 'col-6';
                     row2.appendChild(col6v4);

                     let card5 = document.createElement('div');
                     card5.classList = 'card text-center';
                     col6v4.appendChild(card5);

                     let cardHeadeR4 = document.createElement('h5');
                     cardHeadeR4.classList = 'card-header';
                     cardHeadeR4.innerText = 'Pourcentage de réponses correctes';
                     card5.appendChild(cardHeadeR4);

                     let card5Body = document.createElement('p');
                     card5Body.classList = 'card-body display-1';

                     let divStudents = document.createElement('div');
                     divStudents.classList = 'mt-5';
                     card.appendChild(divStudents);

                     let listStudents = document.createElement('ul');
                     listStudents.classList = 'list-group';
                     divStudents.appendChild(listStudents);

                     let numberOfAnswers = 0;

                     let numberCorrestAnswers = 0;

                     listOfStudentsWithTheirAnswers[index].forEach(student => {
                            let liStudent = document.createElement('li');
                            if (student.result == true) {
                                   liStudent.classList = 'list-group-item list-group-item-action list-group-item-success collapsed';
                                   numberCorrestAnswers++;
                            } else {
                                   liStudent.classList = 'list-group-item list-group-item-action list-group-item-danger collapsed';
                            }
                            liStudent.innerHTML = student['studentMail'];
                            liStudent.setAttribute('data-bs-toggle', 'collapse');
                            liStudent.setAttribute('data-bs-target', `#collapse${student['studentMail']}`);
                            liStudent.setAttribute('aria-expanded', 'false');
                            liStudent.setAttribute('aria-controls', `collapse${student['studentMail']}`);

                            listStudents.appendChild(liStudent);

                            let div = document.createElement('div');
                            div.classList = 'collapse';

                            div.setAttribute('id', `collapse${student['studentMail']}`);
                            listStudents.appendChild(div);

                            let studentAnswersDiv = document.createElement('div');
                            studentAnswersDiv.classList = 'd-flex justify-content-center mt-2';
                            div.appendChild(studentAnswersDiv);
                            let isAnswerCounted = false;
                            student.answerSubmitted.forEach((answer, index) => {
                                   if (answer != null && answer != '') {
                                          if (!isAnswerCounted) {

                                                 numberOfAnswers++;
                                                 isAnswerCounted = true;
                                          }


                                          let studentAnswer = document.createElement('p');
                                          studentAnswer.classList = 'list-group-item border rounded-end rounded-start border-primary-subtle w-25 align-self-center';

                                          studentAnswer.innerHTML = answer;
                                          studentAnswersDiv.appendChild(studentAnswer);
                                   }
                                   card2Body.innerHTML = numberOfAnswers;
                                   card2.appendChild(card2Body);

                                   card3Body.innerHTML = numberOfAnswers / listOfStudentsWithTheirAnswers[index].length * 100 + '%';
                                   card3.appendChild(card3Body);

                            });
                     });
                     card4Body.innerHTML = numberCorrestAnswers;
                     card4.appendChild(card4Body);

                     card5Body.innerHTML = numberCorrestAnswers / numberOfAnswers * 100 + '%';
                     card5.appendChild(card5Body);

                     document.querySelector(selector).appendChild(questionDiv);
              })
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

       createAccordionItemForQuestionAndAnswers(questionNumber, question, answers, correctAnswers, selector) {

              let accordionItem = document.createElement("div");
              accordionItem.classList.add("accordion-item", "questions");
              accordionItem.setAttribute("id", "question" + questionNumber);
       
              let h2 = document.createElement("h2");
              h2.classList.add("accordion-header");
              h2.setAttribute("id", "heading" + questionNumber);
       
              let button = document.createElement("button");
              button.classList.add("accordion-button", "collapsed");
              button.setAttribute("type", "button");
              button.setAttribute("data-bs-toggle", "collapse");
              button.setAttribute("data-bs-target", "#collapse" + questionNumber);
              button.setAttribute("aria-expanded", "false");
              button.setAttribute("aria-controls", "collapseOne");
              button.innerHTML = "Question n°" + questionNumber;
       
              h2.appendChild(button);
       
              let collapseOne = document.createElement("div");
              collapseOne.setAttribute("id", "collapse" + questionNumber);
              collapseOne.classList.add("accordion-collapse", "collapse");
              collapseOne.setAttribute("aria-labelledby", "heading" + questionNumber);
       
              let div = document.createElement("div");
              div.classList.add("accordion-body");
       
              let questionDiv = document.createElement("div");
              questionDiv.classList.add("mb-3");
       
              let label = document.createElement("label");
              label.classList.add("form-label");
              label.setAttribute("for", "question" + questionNumber);
              label.innerHTML = "Question";
       
              let inputDiv = document.createElement("div");
              inputDiv.classList.add("d-flex", "flex-row", "align-items-center");
       
              let input = document.createElement("input");
              input.classList.add("form-control", "me-3");
              input.setAttribute("id", "question" + questionNumber);
              input.setAttribute("type", "text");
              input.setAttribute("value", "");
              input.setAttribute("disabled", "disabled");
              input.value = question;
       
              let iElem = document.createElement("i");
              iElem.classList.add("bi", "bi-pen");
              iElem.setAttribute("id", "editOrConfirmQuestion" + questionNumber);
              iElem.setAttribute("style", "font-size: 2rem;");
       
              iElem.addEventListener('click', (e) => {
                     if (input.hasAttribute('disabled')) {
                            input.removeAttribute('disabled');
                            iElem.classList = 'bi-check';
                            iElem.style = "font-size: 2rem;";
                     } else {
                            input.setAttribute('disabled', 'disabled');
                            iElem.classList = 'bi-pen';
                            iElem.style = "font-size: 2rem;";
                     }
              });
       
              inputDiv.appendChild(input);
              inputDiv.appendChild(iElem);
       
              questionDiv.appendChild(label);
              questionDiv.appendChild(inputDiv);
       
              collapseOne.appendChild(div);
              accordionItem.appendChild(h2);
              accordionItem.appendChild(collapseOne);
       
              div.appendChild(questionDiv);
              for (let i = 1; i <= 4; i++) {
                     let questionDiv = document.createElement("div");
                     questionDiv.classList.add("mb-3");
       
                     let label = document.createElement("label");
                     label.classList.add("form-label");
                     label.setAttribute("for", "answer" + i);
                     label.innerHTML = "Réponse n°" + i;
       
                     let inputDiv = document.createElement("div");
                     inputDiv.classList.add("d-flex", "flex-row", "align-items-center");
       
                     let checkBoxDiv = document.createElement("div");
                     checkBoxDiv.classList.add("form-check", "me-3");
       
                     inputDiv.appendChild(checkBoxDiv);
       
                     let checkBox = document.createElement("input");
                     checkBox.classList.add("form-check-input");
                     checkBox.setAttribute("type", "checkbox");
                     checkBox.setAttribute("value", "");
                     checkBox.setAttribute("id", "checkBoxCorrectAnswer" + i);
                     checkBox.setAttribute("disabled", "disabled");
       
                     if (correctAnswers.includes(answers[i - 1])) {
                            checkBox.checked = true;
                     } else {
                            checkBox.checked = false;
                     }
                     checkBoxDiv.appendChild(checkBox);
       
                     let input = document.createElement("input");
                     input.classList.add("form-control", "me-3", 'answer');
                     input.setAttribute("id", "confirmAnswer" + i);
                     input.setAttribute("type", "text");
                     input.setAttribute("value", "");
                     input.setAttribute("disabled", "disabled");
                     input.value = answers[i - 1];
       
                     let iElem = document.createElement("i");
                     iElem.classList.add("bi", "bi-pen");
                     iElem.setAttribute("id", "editOrConfirmAnswer" + i);
                     iElem.setAttribute("style", "font-size: 2rem;");
       
                     inputDiv.appendChild(input);
                     inputDiv.appendChild(iElem);
       
                     iElem.addEventListener('click', (e) => {
                            if (input.hasAttribute('disabled')) {
                                   input.removeAttribute('disabled');
                                   iElem.classList = 'bi-check';
                                   iElem.style = "font-size: 2rem;";
                                   checkBox.removeAttribute('disabled');
                            } else {
                                   input.setAttribute('disabled', 'disabled');
                                   iElem.classList = 'bi-pen';
                                   iElem.style = "font-size: 2rem;";
                                   checkBox.setAttribute('disabled', 'disabled');
                            }
                     });
       
                     questionDiv.appendChild(label);
                     questionDiv.appendChild(inputDiv);
       
                     div.appendChild(questionDiv);
              }
       
              collapseOne.appendChild(div);
              accordionItem.appendChild(h2);
              accordionItem.appendChild(collapseOne);
              document.querySelector(selector).appendChild(accordionItem);
       }

       /* methods for seeQuizzResults.php */

       displayDatesOfSelectedQuizz(data, selector) { /* [0] = error or success, [1] = quizzListTitles[] || error message */
              let quizzList = document.querySelector(selector);
              quizzList.innerHTML = "";
              data[1].forEach((quizzName) => {
                     let li = document.createElement('li');
                     quizzList.appendChild(li);
                     let span = document.createElement('span');
                     span.classList = "dropdown-item";
                     span.id = "dateInList";
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
              return document.querySelectorAll('#dateInList');
       }
}