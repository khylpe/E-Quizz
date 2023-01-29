let quizzTitle;
let questionsAndAnswers = [];
let mail = document.querySelector('#mail').innerHTML;

const maClasse = new teacher(mail);

document.querySelector('section#creatingQuizz #questionAndAnswers').style.display = "none";
document.querySelector('section#confirmQuizz').style.display = "none";

document.querySelector('#quizzTitleForm').addEventListener('submit', (e) => {
       e.preventDefault();
       quizzTitle = document.querySelector('#creatingQuizz #quizzTitle').value;
       document.querySelector('#title').style.display = "none";
       document.querySelector('#questionAndAnswers').style.display = "block";
});

document.querySelector('#confirmQuestionAndAnswersForm').addEventListener('submit', (e) => {
       e.preventDefault();
       document.querySelector('#confirmQuizz').style.display = "block";

       let questionAndAnswers = { question: "", answers: [], correctAnswers: [] };

       let question = document.querySelector('#questionValue').value;
       questionAndAnswers['question'] = question;
       questionAndAnswers['answers'].push(document.querySelector('#answer1').value);
       questionAndAnswers['answers'].push(document.querySelector('#answer2').value);
       questionAndAnswers['answers'].push(document.querySelector('#answer3').value);
       questionAndAnswers['answers'].push(document.querySelector('#answer4').value);

       document.querySelectorAll('input[type="checkbox"]').forEach((element, index) => {
              if (element.checked) {
                     questionAndAnswers['correctAnswers'].push(document.querySelectorAll('#answers input[type="text"]')[index].value);
              }
       });
       questionsAndAnswers.push(questionAndAnswers);

       document.querySelector('#questionValue').value = "";
       document.querySelector('#answer1').value = "";
       document.querySelector('#answer2').value = "";
       document.querySelector('#answer3').value = "";
       document.querySelector('#answer4').value = "";

       document.querySelectorAll('input[type="checkbox"]').forEach(element => {
              element.checked = false
       });

       document.querySelector('#questionNumber').innerHTML = `Question n°${questionsAndAnswers.length + 1} :`;
});

document.querySelector('#confirmQuizz').addEventListener('click', async (e) => {
       document.querySelector('section#creatingQuizz').style.display = "none";
       document.querySelector('section#confirmQuizz').style.display = "block";
       maClasse.createAndAppendConfirmQuizzTitle(quizzTitle, "section#confirmQuizz #dataConfirmQuizz");

       //create the accordion for the questions and answers
       let accordion = document.createElement('div');
       accordion.classList.add('accordion', 'mt-5');
       accordion.setAttribute('id', 'accordionConfirmQuizz');
       document.querySelector('section#confirmQuizz #dataConfirmQuizz').appendChild(accordion);

       // append the questions and answers to the accordion
       questionsAndAnswers.forEach((element, index) => { // element = {question: "questionValue", answers: [], correctAnswers: []}
              createAccordionItemForQuestionAndAnswers(index + 1, element.question, element.answers, element.correctAnswers, "#accordionConfirmQuizz");
       });


       /* add the event listener to the buttons to modify the answers */
       let allQuestionsAndAnswers = document.querySelectorAll('.questions');
       allQuestionsAndAnswers.forEach((currentQuestion) => {
              let allQuestionsAndAnswersID = currentQuestion.getAttribute('id'); // ex: questions1 which is the id of the div containing the question and the answers
              let buttonsModifyAnswer = document.querySelectorAll('#' + allQuestionsAndAnswersID + ' i') // ex: buttonsModifyAnswer = [i, i, i, i] which are the buttons to modify the answers of the current question
              buttonsModifyAnswer.forEach((button, index) => {
                     button.addEventListener('click', () => {
                            let answerInput = document.querySelector('#' + allQuestionsAndAnswersID + " #confirmAnswer" + index); // ex: confirmAnswer1 which is the input containing the answer, related to the button clicked
                            let checkBoxInput = document.querySelector('#' + allQuestionsAndAnswersID + " #checkBoxCorrectAnswer" + index); // ex: checkBoxCorrectAnswer1 which is the checkbox to check if the answer is correct, related to the button clicked

                            if (answerInput.hasAttribute('disabled')) {
                                   answerInput.removeAttribute('disabled');
                                   button.classList = 'bi-check';
                                   button.style = "font-size: 2rem;";
                                   checkBoxInput.removeAttribute('disabled');
                            } else {
                                   button.classList = 'bi-pen';
                                   button.style = "font-size: 2rem;";
                                   answerInput.setAttribute('disabled', 'disabled');
                                   checkBoxInput.setAttribute('disabled', 'disabled');
                            }
                     });
              })
       });
       /* end of the event listener to the buttons to modify the answers */

       return await fetch('/src/php/createQuizz.php', {
              method: 'POST',
              body: JSON.stringify({ mail: mail, quizzTitle: quizzTitle, questionsAndAnswers: questionsAndAnswers })
       })
              .then(result => result.json())
              .then(array => {
                     if (array[0] == "success") {
                            if (array[1].length > 0) {
                                   return Array('success', array[1]);
                            }
                            else {
                                   return Array('error', 'Vous devez créer un quizz avant de pouvoir créer une session');
                            }
                     } else {
                            return Array('error', 'Une erreur est survenue lors de la récupération de la liste des quizz : ' + array[1]);
                     }
              })
              .catch(err => {
                     return Array('error', err);
              });
});



function createAccordionItemForQuestionAndAnswers(questionNumber, question, answers, correctAnswers, selector) {

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
       iElem.setAttribute("id", "editOrConfirmTitle" + questionNumber);
       iElem.setAttribute("style", "font-size: 2rem;");

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

              questionDiv.appendChild(label);
              questionDiv.appendChild(inputDiv);

              div.appendChild(questionDiv);
       }

       collapseOne.appendChild(div);
       accordionItem.appendChild(h2);
       accordionItem.appendChild(collapseOne);
       document.querySelector(selector).appendChild(accordionItem);
}