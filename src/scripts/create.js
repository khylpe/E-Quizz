let quizzNumber = null;

import BackCreate from "./classes/back/BackCreate.js";
import FrontCreate from "./classes/front/FrontCreate.js";

const Back = new BackCreate(document.querySelector('#mail').innerHTML);
const Front = new FrontCreate();

alterSaveStatus("saved", '#saveStatus');
Front.setCurrentSection('#createQuizz');

Front.addQuestion(1, '', [], [], '#dataCreateQuizz');

document.querySelector('#addQuestion').addEventListener('click', async (e) => {
       e.preventDefault();
       saveQuizz(false);
});

document.querySelector('#confirmQuizzButton').addEventListener('click', (e) => {
       e.preventDefault();
       saveQuizz(true);
});

document.querySelectorAll('input').forEach((input) => {
       input.addEventListener('change', (e) => {
              alterSaveStatus("not saved", '#saveStatus');
       });
});

document.querySelectorAll('input').forEach((input) => {
       input.addEventListener('input', (e) => {
              alterSaveStatus("not saved", '#saveStatus');
       });
});

function saveQuizz(isQuizzFinished) {
       let finalQuestionsAndAnswers = [];
       let numberOfPossibleAnswers = 0;
       let allQuestionsAndAnswers = document.querySelectorAll('.questions');
       allQuestionsAndAnswers.forEach((currentQuestion, index) => {

              let allQuestionsAndAnswersID = currentQuestion.getAttribute('id'); // ex: questions1 which is the id of the div containing the question and the answers

              let allPossibleAnswersForThisQuestion = document.querySelectorAll('#' + allQuestionsAndAnswersID + ' input[type="text"].answer');
              let allCorrectAnswersForThisQuestion = document.querySelectorAll('#' + allQuestionsAndAnswersID + " input[type='checkbox']");

              let questionValue = document.querySelector('#' + allQuestionsAndAnswersID + ' input[type="text"]').value;

              if(document.querySelector('#quizzTitle').value == '') {
                     Front.tempMessage("error", "Veuillez saisir un titre à votre quizz", "#tempMessage");
                     alterSaveStatus("not saved", '#saveStatus');
                     return;
              }
              if (questionValue != '') {

                     // if there is no correct answer, we don't save the quizz
                     if (document.querySelectorAll(`#${allQuestionsAndAnswersID} input[type="checkbox"]:checked`).length == 0) {
                            Front.tempMessage("error", `Veuillez sélectionner au moins une bonne réponse à la question n°${index + 1}`, "#tempMessage");
                            alterSaveStatus("not saved", '#saveStatus');
                            return;
                     }

                     let questAndAns = { question: questionValue, answers: [], correctAnswers: [] };

                     allPossibleAnswersForThisQuestion.forEach((element) => {
                            if (element.value != "")
                                   numberOfPossibleAnswers++;
                            questAndAns.answers.push(element.value);
                     });

                     // if there is less than 2 possible answers, we don't save the quizz
                     if (numberOfPossibleAnswers < 2) {
                            Front.tempMessage("error", `Veuillez saisir au moins 2 réponses possibles à la question n°${index + 1}`, "#tempMessage");
                            alterSaveStatus("not saved", '#saveStatus');
                            return;
                     }

                     allCorrectAnswersForThisQuestion.forEach((element, indexOfCorrectAnswer) => {
                            if (element.checked) {
                                   let numberOfTheCorrectAnswer = indexOfCorrectAnswer + 1;
                                   let valueOfTheCorrectAnswer = document.querySelector('#' + allQuestionsAndAnswersID + " input[type='text']#confirmAnswer" + numberOfTheCorrectAnswer).value;
                                   questAndAns.correctAnswers.push(valueOfTheCorrectAnswer);
                            }
                     });
                     finalQuestionsAndAnswers.push(questAndAns);

                     if (quizzNumber == null) {
                            Back.checkIfQuizzNameIsAvailable(document.querySelector('#quizzTitle').value)
                                   .then((response) => {
                                          if (response[0] == "success") {
                                                 Back.createQuizzNumber().then((responseQuizzNumber) => {
                                                        quizzNumber = responseQuizzNumber;
                                                        Back.createQuizz(document.querySelector('#quizzTitle').value, finalQuestionsAndAnswers, quizzNumber)
                                                 });
                                                 Front.tempMessage("success", "Quizz sauvegardé", "#tempMessage");
                                                 alterSaveStatus("saved", '#saveStatus');
                                                 Front.setCurrentSection("#quizzCreated");
                                          } else {
                                                 Front.tempMessage("error", "Quizz non sauvegardé : " + response[1], "#tempMessage");
                                                 alterSaveStatus("not saved", '#saveStatus');
                                          }
                                   })
                                   .catch((error) => {
                                          Front.tempMessage("error", "Quizz non sauvegardé : " + error, "#tempMessage");
                                          alterSaveStatus("not saved", '#saveStatus');
                                   });
                     } else {
                            Back.modifyQuizz(document.querySelector('#quizzTitle').value, finalQuestionsAndAnswers, quizzNumber)
                            Front.tempMessage("success", "Quizz sauvegardé", "#tempMessage");
                            alterSaveStatus("saved", '#saveStatus');
                     }
              } else if (isQuizzFinished || index + 1 == allQuestionsAndAnswers.length) {
                     Front.tempMessage("warning", `Veuillez remplir l'intitulé de la question n°${index + 1}`, "#tempMessage");
                     alterSaveStatus("not saved", '#saveStatus');
              }
       });
}

function alterSaveStatus(status, selector) {
       if (status == "saved") {
              document.querySelector(selector).style.color = "green";
       } else if (status == "not saved") {
              document.querySelector(selector).style.color = "red";
       } else {
              document.querySelector(selector).style.color = "orange";
       }
}