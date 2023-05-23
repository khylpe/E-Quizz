import FrontGlobal from "./FrontGlobal.js";

export default class FrontCreate extends FrontGlobal {

       constructor() {
              super();
       }

       addQuestion(questionNumber, question, answers, correctAnswers, selector) {
              if(!document.querySelector(selector)) return;

              let divWithQuestionAndDeleteButton = document.createElement('div');
              divWithQuestionAndDeleteButton.classList.add('d-flex', 'flex-row', 'justify-content-center', 'align-items-baseline');

              let accordionItem = document.createElement("div");
              accordionItem.classList.add("accordion-item", "questions", "flex-fill");
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
              questionDiv.classList.add("mb-3", "d-flex", "flex-column", "align-items-center");
              questionDiv.setAttribute("id", "questionDiv");

              let label = document.createElement("label");
              label.classList.add("form-label");
              label.setAttribute("for", "question" + questionNumber);
              label.innerHTML = "Question";

              let input = document.createElement("input");
              input.classList.add("form-control", "me-3");
              input.setAttribute("id", "question" + questionNumber);
              input.setAttribute("type", "text");
              input.setAttribute("value", "");
              input.setAttribute("autocomplete", "off");

              input.value = question;

              input.addEventListener('input', (e) => {
                     let question = e.target.value;
                     button.innerHTML = `Question n° ${questionNumber} : ${question}`;
              });

              questionDiv.appendChild(label);
              questionDiv.appendChild(input);
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
                     input.setAttribute("autocomplete", "off");

                     (answers[i - 1]) ? input.value = answers[i - 1] : input.value = '';

                     inputDiv.appendChild(input);

                     questionDiv.appendChild(label);
                     questionDiv.appendChild(inputDiv);
                     div.appendChild(questionDiv);
              }

              collapseOne.appendChild(div);
              accordionItem.appendChild(h2);
              accordionItem.appendChild(collapseOne);

              let buttonDeleteQuestion = document.createElement('button');
              buttonDeleteQuestion.classList.add('btn', 'btn-danger', 'deleteQuestion', "ms-2");
              buttonDeleteQuestion.innerHTML = '<i class="bi bi-trash"></i>';
              buttonDeleteQuestion.setAttribute('type', 'button');
              buttonDeleteQuestion.name = "deleteQuestion";
              divWithQuestionAndDeleteButton.appendChild(accordionItem);

              divWithQuestionAndDeleteButton.appendChild(buttonDeleteQuestion);
              document.querySelector(selector).appendChild(divWithQuestionAndDeleteButton);

              if (!document.querySelector('#addQuestion')) {
                     let buttonAddQuestion = document.createElement('button');
                     buttonAddQuestion.classList.add('btn', 'btn-info', 'mt-5', 'z-100');
                     buttonAddQuestion.id = 'addQuestion';
                     let icon = document.createElement('i');
                     icon.classList.add('bi', 'bi-plus-circle-dotted');
                     let span = document.createElement('span');
                     span.classList.add('ms-3');
                     span.textContent = 'Ajouter une question au QCM';
                     icon.appendChild(span);
                     buttonAddQuestion.appendChild(icon);

                     document.querySelector(selector).insertAdjacentElement('afterend', buttonAddQuestion);
              }
       }

       reindexQuestions() {
              let questions = document.querySelectorAll('.questions');
              let questionNumber = 1;
              questions.forEach(question => {
                     question.id = `question${questionNumber}`;
                     question.querySelector('h2').id = `heading${questionNumber}`;
                     question.querySelector('button').setAttribute('data-bs-target', `#collapse${questionNumber}`);

                     let input = document.querySelector(`#question${questionNumber} #questionDiv input`);
                     console.log(input.value);

                     if(input.value == ''){
                            question.querySelector('button').innerHTML = `Question n°${questionNumber}`;
                     }
                     else{
                            question.querySelector('button').innerHTML = `Question n°${questionNumber} : ${input.value}`;
                     }

                     document.querySelector(`#question${questionNumber} #questionDiv label`).setAttribute('for', `question${questionNumber}`);
                     input.id = `question${questionNumber}`;
                     question.querySelector('div.accordion-collapse').id = `collapse${questionNumber}`;
                     question.querySelector('div.accordion-collapse').setAttribute('aria-labelledby', `heading${questionNumber}`);

                     questionNumber++;
              });
       }
}