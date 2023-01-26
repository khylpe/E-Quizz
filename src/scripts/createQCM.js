let quizzTitle;
let questionsAndAnswers = [];
let mail = document.querySelector('#mail').innerHTML;

document.querySelector('#questionAndAnswers').style.display = "none";
document.querySelector('#confirmQuizz').style.display = "none";


document.querySelector('#confirmTitle').addEventListener('click', (e) => {
       quizzTitle = document.querySelector('#quizzTitle').value;
       document.querySelector('#title').style.display = "none";
       document.querySelector('#questionAndAnswers').style.display = "block";
})

document.querySelector('#confirmQuestionAndAnswers').addEventListener('click', (e) => {
       document.querySelector('#confirmQuizz').style.display = "block";

       let questionAndAnswers = [[],[],[]];

       let question = document.querySelector('#questionValue').value;
       questionAndAnswers[0] = question;
       questionAndAnswers[1] = [
              document.querySelector('#answer1').value,
              document.querySelector('#answer2').value,
              document.querySelector('#answer3').value,
              document.querySelector('#answer4').value];

              document.querySelectorAll('input[type="checkbox"]').forEach((element, index) => {
                     if (element.checked) {
                            questionAndAnswers[2].push(document.querySelectorAll('#answers input[type="text"]')[index].value);
                     }
              });
       questionsAndAnswers.push(questionAndAnswers);

       document.querySelector('#questionValue').value = "";
       document.querySelector('#answer1').value = "";
       document.querySelector('#answer2').value = "";
       document.querySelector('#answer3').value = "";
       document.querySelector('#answer4').value = "";

       console.log(questionsAndAnswers);

       document.querySelectorAll('input[type="checkbox"]').forEach(element => {
              element.checked = false
       });

       document.querySelector('#questionNumber').innerHTML = `Question n°${questionsAndAnswers.length + 1} :`;
});

document.querySelector('#confirmQuizz').addEventListener('click', (e) =>{
       
})