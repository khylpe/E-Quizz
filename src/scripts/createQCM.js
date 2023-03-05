let quizzTitle;
let questionsAndAnswers = [];

const maClasse = new Teacher();
const fetchData = new DB(document.querySelector('#mail').innerHTML);

document.querySelector('section#creatingQuizz #questionAndAnswers').style.display = "none";
document.querySelector('section#confirmQuizz').style.display = "none";
document.querySelector('#checkQuizz').style.display = "none";

maClasse.setCurrentSection('#creatingQuizz');

document.querySelector('#quizzTitleForm').addEventListener('submit', (e) => {
       e.preventDefault();
       quizzTitle = document.querySelector('#creatingQuizz #quizzTitle').value;
       document.querySelector('#title').style.display = "none";
       document.querySelector('#questionAndAnswers').style.display = "block";
});

document.querySelector('#confirmQuestionAndAnswersForm').addEventListener('submit', (e) => {
       e.preventDefault();

       if (document.querySelectorAll('#answers input[type="checkbox"]:checked').length == 0) {
              maClasse.tempMessage("error", "Veuillez sélectionner au moins une bonne réponse", "#tempMessage");
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
       maClasse.tempMessage("success", "Question ajoutée avec succès", "#tempMessage");
});

document.querySelector('#checkQuizz').addEventListener('click', (e) => {
       document.querySelector('#confirmQuizzButton').style.display = "inline-block";

       maClasse.setCurrentSection('#confirmQuizz');
       maClasse.createAndAppendConfirmQuizzTitle(quizzTitle, "section#confirmQuizz #dataConfirmQuizz");

       //create the accordion for the questions and answers
       let accordion = document.createElement('div');
       accordion.classList.add('accordion', 'mt-5');
       accordion.setAttribute('id', 'accordionConfirmQuizz');
       document.querySelector('section#confirmQuizz #dataConfirmQuizz').appendChild(accordion);

       // append the questions and answers to the accordion
       questionsAndAnswers.forEach((element, index) => { // element = {question: "questionValue", answers: [], correctAnswers: []}
              maClasse.createAccordionItemForQuestionAndAnswers(index + 1, element.question, element.answers, element.correctAnswers, "#accordionConfirmQuizz");
       });
});

document.querySelector('#confirmQuizzButton').addEventListener('click', async (e) => {
       fetchData.setQuizzName(document.querySelector('#confirmQuizz #confirmQuizzTitle').value);
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

       fetchData.createQuizz(finalQuestionsAndAnswers)
              .then((response) => {
                     if (response[0] == "success") {
                            maClasse.tempMessage("success", "Quizz créé avec succès", "#tempMessage");
                            maClasse.setCurrentSection("#quizzCreated");                            
                     } else {
                            maClasse.tempMessage("danger", "Quizz non créé : " + response[1], "#tempMessage");
                     }
              })
              .catch((error) => {
                     maClasse.tempMessage("error", "Quizz non créé from php : " + error, "#tempMessage");
              });
});