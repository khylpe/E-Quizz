import FrontGlobal from "./FrontGlobal.js";

export default class FrontCreate extends FrontGlobal {

       constructor() {
              super();
       }

       addQuestion(questionNumber, question, answers, correctAnswers, selector) {
              const test = this;
              let accordionItem = document.createElement("div");
              accordionItem.classList.add("accordion-item", "questions");
              accordionItem.id = `question${questionNumber}`;

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
              input.value = question;

              input.addEventListener('input', (e) => {
                     let question = e.target.value;
                     button.innerHTML = `Question n° ${questionNumber} : ${question}`;
              });

              inputDiv.appendChild(input);

              questionDiv.appendChild(label);
              questionDiv.appendChild(inputDiv);
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
                     (answers[i - 1]) ? input.value = answers[i - 1] : input.value = '';

                     inputDiv.appendChild(input);

                     questionDiv.appendChild(label);
                     questionDiv.appendChild(inputDiv);
                     div.appendChild(questionDiv);
              }

              collapseOne.appendChild(div);
              accordionItem.appendChild(h2);
              accordionItem.appendChild(collapseOne);
              document.querySelector(selector).appendChild(accordionItem);

              if (!document.querySelector('#addQuestion')) {
                     let buttonAddQuestion = document.createElement('button');
                     buttonAddQuestion.classList.add('btn', 'btn-info', 'mt-5');
                     buttonAddQuestion.id = 'addQuestion';
                     let icon = document.createElement('i');
                     icon.classList.add('bi', 'bi-plus-circle-dotted');
                     let span = document.createElement('span');
                     span.classList.add('ms-3');
                     span.textContent = 'Ajouter une question au QCM';
                     icon.appendChild(span);
                     buttonAddQuestion.appendChild(icon);

                     document.querySelector(selector).insertAdjacentElement('afterend', buttonAddQuestion);

                     document.querySelector('#addQuestion').addEventListener('click', (e) => {
                            let questionNumber = document.querySelectorAll('.accordion-item').length + 1;
                            let question = '';
                            let answers = ['', '', '', ''];
                            let correctAnswers = [];
                            test.addQuestion(questionNumber, question, answers, correctAnswers, selector);
                     });
              }
       }
}