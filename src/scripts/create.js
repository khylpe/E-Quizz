let quizzTitle;
let questionsAndAnswers = [];

import BackCreate from "./classes/back/BackCreate.js";
import FrontCreate from "./classes/front/FrontCreate.js";

const Back = new BackCreate(document.querySelector('#mail').innerHTML);
const Front = new FrontCreate();

document.querySelector('section#creatingQuizz #questionAndAnswers').style.display = "none";
document.querySelector('section#confirmQuizz').style.display = "none";
document.querySelector('#checkQuizz').style.display = "none";

Front.setCurrentSection('#creatingQuizz');

document.querySelector('#quizzTitleForm').addEventListener('submit', (e) => {
       e.preventDefault();
       quizzTitle = document.querySelector('#creatingQuizz #quizzTitle').value;
       document.querySelector('#title').style.display = "none";
       document.querySelector('#questionAndAnswers').style.display = "block";
});

document.querySelector('#confirmQuestionAndAnswersForm').addEventListener('submit', (e) => {
       e.preventDefault();

       if (document.querySelectorAll('#answers input[type="checkbox"]:checked').length == 0) {
              Front.tempMessage("error", "Veuillez sélectionner au moins une bonne réponse", "#tempMessage");
              return;
       }
       document.querySelector('#checkQuizz').style.display = "inline-block";

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
              element.checked = false;
       });

       document.querySelector('#questionNumber').innerHTML = `Question n°${questionsAndAnswers.length + 1} :`;
       Front.tempMessage("success", "Question ajoutée avec succès", "#tempMessage");
});

document.querySelector('#checkQuizz').addEventListener('click', (e) => {
       document.querySelector('#confirmQuizzButton').style.display = "inline-block";

       Front.setCurrentSection('#confirmQuizz');
       Front.createAndAppendConfirmQuizzTitle(quizzTitle, "section#confirmQuizz #dataConfirmQuizz");

       //create the accordion for the questions and answers
       let accordion = document.createElement('div');
       accordion.classList.add('accordion', 'mt-5');
       accordion.setAttribute('id', 'accordionConfirmQuizz');
       document.querySelector('section#confirmQuizz #dataConfirmQuizz').appendChild(accordion);

       // append the questions and answers to the accordion
       questionsAndAnswers.forEach((element, index) => { // element = {question: "questionValue", answers: [], correctAnswers: []}
              Front.createAccordionItemForQuestionAndAnswers(index + 1, element.question, element.answers, element.correctAnswers, "#accordionConfirmQuizz");
       });
});

document.querySelector('#confirmQuizzButton').addEventListener('click', async (e) => {
       Back.setQuizzName(document.querySelector('#confirmQuizz #confirmQuizzTitle').value);
       let finalQuestionsAndAnswers = [];

       let allQuestionsAndAnswers = document.querySelectorAll('.questions');
       allQuestionsAndAnswers.forEach((currentQuestion) => {

              let allQuestionsAndAnswersID = currentQuestion.getAttribute('id'); // ex: questions1 which is the id of the div containing the question and the answers

              let allPossibleAnswersForThisQuestion = document.querySelectorAll('#' + allQuestionsAndAnswersID + ' input[type="text"].answer');
              let allCorrectAnswersForThisQuestion = document.querySelectorAll('#' + allQuestionsAndAnswersID + " input[type='checkbox']");

              let questAndAns = { question: document.querySelector('#' + allQuestionsAndAnswersID + ' input[type="text"]').value, answers: [], correctAnswers: [] };

              allPossibleAnswersForThisQuestion.forEach((element) => {
                     questAndAns.answers.push(element.value);
              });

              allCorrectAnswersForThisQuestion.forEach((element, indexOfCorrectAnswer) => {
                     if (element.checked) {
                            let numberOfTheCorrectAnswer = indexOfCorrectAnswer + 1;
                            let valueOfTheCorrectAnswer = document.querySelector('#' + allQuestionsAndAnswersID + " input[type='text']#confirmAnswer" + numberOfTheCorrectAnswer).value;
                            questAndAns.correctAnswers.push(valueOfTheCorrectAnswer);
                     }
              });

              finalQuestionsAndAnswers.push(questAndAns);
       });

       Back.createQuizz(finalQuestionsAndAnswers)
              .then((response) => {
                     if (response[0] == "success") {
                            Front.tempMessage("success", "Quizz créé avec succès", "#tempMessage");
                            Front.setCurrentSection("#quizzCreated");                            
                     } else {
                            Front.tempMessage("danger", "Quizz non créé : " + response[1], "#tempMessage");
                     }
              })
              .catch((error) => {
                     Front.tempMessage("error", "Quizz non créé from php : " + error, "#tempMessage");
              });
});