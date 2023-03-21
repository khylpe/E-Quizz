import FrontGlobal from "./FrontGlobal.js";

export default class FrontCreate extends FrontGlobal {
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
}