export default class FrontGlobal {
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

       setCurrentSection(elementToDisplay) {
              document.querySelectorAll('section').forEach((section) => {
                     section.style.display = "none";
              });
              document.querySelector(`${elementToDisplay}`).style.display = "block";
       }

       getCurrentSection() {
              return document.querySelector('section:not([style*="display: none"])'); // https://stackoverflow.com/a/39813096/19601188
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

       displayResults(questions, selector) {
              document.querySelector(selector).innerHTML = "";
              let numberOfQuestions = questions.length;
              questions.forEach((question) => {
                     let questionDiv = document.createElement('div');
                     questionDiv.classList = 'accordion-item border border-primary-subtle questions';
                     questionDiv.setAttribute('id', `question${question.questionNumber}`);

                     let questionHeader = document.createElement('h2');
                     questionHeader.classList = 'accordion-header';
                     questionDiv.appendChild(questionHeader);

                     let questionButton = document.createElement('button');
                     questionButton.classList = 'accordion-button collapsed';
                     questionButton.setAttribute('type', 'button');
                     questionButton.setAttribute('data-bs-toggle', 'collapse');
                     questionButton.setAttribute('data-bs-target', `#collapse${question.questionNumber}`);
                     questionButton.setAttribute('aria-expanded', 'false');
                     questionButton.setAttribute('aria-controls', `collapse${question.questionNumber}`);
                     questionButton.innerText = `Question ${question.questionNumber}/${numberOfQuestions} : ${question.question}`;
                     questionHeader.appendChild(questionButton);

                     let questionBody = document.createElement('div');
                     questionBody.classList = 'accordion-collapse collapse';
                     questionBody.setAttribute('id', `collapse${question.questionNumber}`);
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
                     console.log(JSON.stringify(questions, null, 2));
                     question.answers.forEach(studentAnswers => {
                            let liStudent = document.createElement('li');
                            if (studentAnswers.result == true) {
                                   liStudent.classList = 'list-group-item list-group-item-action list-group-item-success collapsed';
                                   numberCorrestAnswers++;
                            } else {
                                   liStudent.classList = 'list-group-item list-group-item-action list-group-item-danger collapsed';
                            }
                            liStudent.innerHTML = studentAnswers['studentMail'];
                            liStudent.setAttribute('data-bs-toggle', 'collapse');
                            liStudent.setAttribute('data-bs-target', `#collapse${studentAnswers['studentMail']}`);
                            liStudent.setAttribute('aria-expanded', 'false');
                            liStudent.setAttribute('aria-controls', `collapse${studentAnswers['studentMail']}`);

                            listStudents.appendChild(liStudent);

                            let div = document.createElement('div');
                            div.classList = 'collapse';

                            div.setAttribute('id', `collapse${studentAnswers['studentMail']}`);
                            listStudents.appendChild(div);

                            let studentAnswersDiv = document.createElement('div');
                            studentAnswersDiv.classList = 'd-flex justify-content-center mt-2';
                            div.appendChild(studentAnswersDiv);
                            let isAnswerCounted = false;
                            studentAnswers.studentAnswer.forEach((answer, index) => {
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

                                   card3Body.innerHTML = numberOfAnswers / question.answers.length * 100 + '%';
                                   card3.appendChild(card3Body);

                            });
                     });
                     card4Body.innerHTML = numberCorrestAnswers;
                     card4.appendChild(card4Body);

                     if (numberOfAnswers < 0) {
                            card5Body.innerHTML = numberCorrestAnswers / numberOfAnswers * 100 + '%';
                     }
                     else {
                            card5Body.innerHTML = '0%';
                     }
                     card5.appendChild(card5Body);
                     document.querySelector(selector).appendChild(questionDiv);
              })
       }
}