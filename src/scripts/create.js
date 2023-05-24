let quizzNumber = null;

import BackCreate from "./classes/back/BackCreate.js";
import FrontCreate from "./classes/front/FrontCreate.js";

const Back = new BackCreate(document.querySelector('#mail').innerHTML);
const Front = new FrontCreate();

alterSaveStatus("saved", '#saveStatus');
Front.setCurrentSection('#createQuizz');

Front.addQuestion(1, '', [], [], '#dataCreateQuizz');
refreshListeners();

document.querySelector('#confirmQuizzButton').addEventListener('click', (e) => {
       e.preventDefault();
       saveQuizz(true);
});

document.querySelector('#addQuestion').addEventListener('click', (e) => {
       let questionNumber = document.querySelectorAll('.accordion-item').length + 1;
       let question = '';
       let answers = ['', '', '', ''];
       let correctAnswers = [];
       Front.addQuestion(questionNumber, question, answers, correctAnswers, "#dataCreateQuizz");
       alterSaveStatus("not saved", '#saveStatus');
       refreshListeners();
});

document.querySelector('#scrollButton').addEventListener('click', (e) => {
       e.preventDefault();
       Front.scrollToLocation('#createQuizz');
});

document.querySelector('#leaveQuizzCreation').addEventListener('click', (e) => {
       e.preventDefault();
       window.location.href = "/navigation.html";
});

function saveQuizz() {
       let finalQuestionsAndAnswers = [];
       let numberOfPossibleAnswers = 0;
       let allQuestionsAndAnswers = document.querySelectorAll('.questions');
       let isQuizzValid = true;
       allQuestionsAndAnswers.forEach((currentQuestion, index) => {

              let allQuestionsAndAnswersID = currentQuestion.getAttribute('id'); // ex: questions1 which is the id of the div containing the question and the answers

              let allPossibleAnswersForThisQuestion = document.querySelectorAll('#' + allQuestionsAndAnswersID + ' input[type="text"].answer');
              let allCorrectAnswersForThisQuestion = document.querySelectorAll('#' + allQuestionsAndAnswersID + " input[type='checkbox']");

              let questionValue = document.querySelector('#' + allQuestionsAndAnswersID + ' input[type="text"]').value;

              allPossibleAnswersForThisQuestion.forEach((element) => {
                     if (element.value != "")
                            numberOfPossibleAnswers++;
              });

              if (document.querySelector('#quizzTitle').value == '') {
                     isQuizzValid = false;
                     Front.tempMessage("error", "Veuillez saisir un titre à votre quizz", "#tempMessage");
                     alterSaveStatus("not saved", '#saveStatus');
                     return;
              }

              // if there is less than 2 possible answers, we don't save the quizz
              if (numberOfPossibleAnswers < 2) {
                     isQuizzValid = false;
                     Front.tempMessage("error", `Veuillez saisir au moins 2 réponses possibles à la question n°${index + 1}`, "#tempMessage");
                     alterSaveStatus("not saved", '#saveStatus');
                     return;
              }

              if (questionValue == '') {
                     isQuizzValid = false;
                     Front.tempMessage("warning", `Veuillez remplir l'intitulé de la question n°${index + 1}`, "#tempMessage");
                     alterSaveStatus("not saved", '#saveStatus');
                     return
              }
              // if there is no correct answer, we don't save the quizz
              if (document.querySelectorAll(`#${allQuestionsAndAnswersID} input[type="checkbox"]:checked`).length == 0) {
                     isQuizzValid = false;
                     console.log(document.querySelectorAll(`#${allQuestionsAndAnswersID}`));
                     Front.tempMessage("error", `Veuillez sélectionner au moins une bonne réponse à la question n°${index + 1}`, "#tempMessage");
                     alterSaveStatus("not saved", '#saveStatus');
                     return;
              }

              // if the corret answer is empty, we don't save the quizz
              let isThereAnEmptyCorrectAnswer = false;
              document.querySelectorAll(`#${allQuestionsAndAnswersID} input[type="checkbox"]`).forEach((element, indexOfCorrectAnswer) => {
                     let numberOfTheCorrectAnswer = indexOfCorrectAnswer + 1;
                     let valueOfTheCorrectAnswer = document.querySelector('#' + allQuestionsAndAnswersID + " input[type='text']#confirmAnswer" + numberOfTheCorrectAnswer).value;

                     console.log('valueOfTheCorrectAnswer', valueOfTheCorrectAnswer);
                     console.log(indexOfCorrectAnswer)
                     if (valueOfTheCorrectAnswer == '' && element.checked) {
                            isThereAnEmptyCorrectAnswer = true;
                     }
              });

              if (isThereAnEmptyCorrectAnswer) {
                     isQuizzValid = false;
                     Front.tempMessage("error", `Veuillez remplir les réponses correctes à la question n°${index + 1}`, "#tempMessage");
                     alterSaveStatus("not saved", '#saveStatus');
                     return;
              }

              let questAndAns = { question: questionValue, answers: [], correctAnswers: [] };

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

       if (!isQuizzValid) return;

       if (quizzNumber == null) {
              Back.checkIfQuizzNameIsAvailable(document.querySelector('#quizzTitle').value)
                     .then((response) => {
                            if (response[0] == "success") {
                                   Back.createQuizzNumber().then((responseQuizzNumber) => {
                                          quizzNumber = responseQuizzNumber;
                                          Back.createQuizz(document.querySelector('#quizzTitle').value, finalQuestionsAndAnswers, quizzNumber)
                                   });
                                   Front.tempMessage("success", "Quizz créé", "#tempMessage");
                                   alterSaveStatus("saved", '#saveStatus');                                   
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

function refreshListeners() { // this code in addQuestion so that the listeners are added to the new questions
       let deleteButtons = document.querySelectorAll('button[name="deleteQuestion"]')

       deleteButtons.forEach((button, i) => {
              button.addEventListener('click', (e) => {
                     e.preventDefault();
                     let temp = document.querySelectorAll('button[name="deleteQuestion"]')


                     if (temp.length <= 1) {
                            Front.tempMessage("error", "Vous ne pouvez pas supprimer la dernière question", "#tempMessage");
                            return;
                     } else {
                            button.parentElement.remove();
                            Front.reindexQuestions();
                     }
              });
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
}