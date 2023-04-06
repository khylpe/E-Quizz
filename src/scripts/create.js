let questionsAndAnswers = [];
let quizzNumber = null;

import BackCreate from "./classes/back/BackCreate.js";
import FrontCreate from "./classes/front/FrontCreate.js";

const Back = new BackCreate(document.querySelector('#mail').innerHTML);
const Front = new FrontCreate();


Front.setCurrentSection('#createQuizz');

Front.addQuestion(1, '', [], [], '#dataCreateQuizz');


document.querySelector('#addQuestion').addEventListener('click', async (e) => {
       e.preventDefault();
       saveQuizz(false);
       // Back.setQuizzName(document.querySelector('#confirmQuizz #confirmQuizzTitle').value);


       // Back.createQuizz(finalQuestionsAndAnswers)
       //        .then((response) => {
       //               if (response[0] == "success") {
       //                      Front.tempMessage("success", "Quizz créé avec succès", "#tempMessage");
       //                      Front.setCurrentSection("#quizzCreated");                            
       //               } else {
       //                      Front.tempMessage("danger", "Quizz non créé : " + response[1], "#tempMessage");
       //               }
       //        })
       //        .catch((error) => {
       //               Front.tempMessage("error", "Quizz non créé from php : " + error, "#tempMessage");
       //        });
});

document.querySelector('#confirmQuizzButton').addEventListener('click', (e) => {
       e.preventDefault();
       saveQuizz(true);
});

function saveQuizz(isQuizzFinished) {
       let finalQuestionsAndAnswers = [];

       let allQuestionsAndAnswers = document.querySelectorAll('.questions');
       allQuestionsAndAnswers.forEach((currentQuestion, index) => {

              let allQuestionsAndAnswersID = currentQuestion.getAttribute('id'); // ex: questions1 which is the id of the div containing the question and the answers

              let allPossibleAnswersForThisQuestion = document.querySelectorAll('#' + allQuestionsAndAnswersID + ' input[type="text"].answer');
              let allCorrectAnswersForThisQuestion = document.querySelectorAll('#' + allQuestionsAndAnswersID + " input[type='checkbox']");

              let questionValue = document.querySelector('#' + allQuestionsAndAnswersID + ' input[type="text"]').value

              if (questionValue != '') {

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

                     Back.checkIfQuizzNameIsAvailable(document.querySelector('#quizzTitle').value)
                            .then((response) => {
                                   if (response[0] == "success") {
                                          if (quizzNumber == null) {
                                                 Back.createQuizzNumber().then((response) => {
                                                        quizzNumber = response;
                                                        Back.createQuizz(document.querySelector('#quizzTitle').value , finalQuestionsAndAnswers, quizzNumber)
                                                 })

                                          }else{
                                                 Back.modifyQuizz(document.querySelector('#quizzTitle').value , finalQuestionsAndAnswers, quizzNumber)
                                          }

                                          Front.tempMessage("success", "Quizz sauvegardé", "#tempMessage");
                                   } else {
                                          Front.tempMessage("error", "Quizz non sauvegardé : " + response[1], "#tempMessage");
                                   }
                            })
                            .catch((error) => {

                            });
              } else if (allQuestionsAndAnswers.length != index + 1 && !isQuizzFinished || allQuestionsAndAnswers.length != index && isQuizzFinished) {
                     Front.tempMessage("warning", `Veuillez remplir l'intitulé de la question n°${index + 1}`, "#tempMessage");
              }
       });
       return console.log(finalQuestionsAndAnswers);
}