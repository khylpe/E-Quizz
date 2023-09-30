document.addEventListener('DOMContentLoaded', () => {
       let studentMail = null;

       // Connexion à socket.io
       const socket = io("http://192.168.0.254:8100", {
              transports:
                     ["websocket"],
              query: {
                     status: 'student'
              }
       });

       socket.on('connect', () => {
              log.textContent += '\n' + 'connected to the server';
       });

       socket.onAny((data) => {
              log.textContent += '\n' + data;
       });

       socket.on('getStudentAnswer', (jsonContainNumberQuestion, callback) => {
              quizzCurrentQuestion = jsonContainNumberQuestion['numberQuestion'];
              let answer = getRandomAnswer();
              log.textContent += '\n' + 'getStudentAnswer, answer sent : ' + JSON.stringify(answer);
              callback({ ...answer, studentMail: studentMail });
       });

       document.getElementById('register').addEventListener('click', () => {
              studentMail = prompt("Entrez votre mail :");
              socket.emit('studentTriesToRegister', studentMail, (response) => {
                     log.textContent += '\n' + 'reponse after trying to register with ' + studentMail + ' : ' + JSON.stringify(response);
              });
       });

       document.querySelector('#answer').addEventListener('click', () => {
              let answerWithNumber = getRandomAnswer();
              let fullData = { ...answerWithNumber, studentMail: studentMail }

              socket.emit('answerChanged', fullData);
              log.textContent += '\n' + 'data sent after changing answer : ' + JSON.stringify(fullData);
       });

       document.querySelector('#validateOrCorrect').onclick = (e) => {
              if (e.target.innerText == "Corriger") {
                     e.target.innerText = "Valider"
                     socket.emit('buttonValidateClicked', false);
              }
              else {
                     e.target.innerText = "Corriger";
                     socket.emit('buttonValidateClicked', true);
              }

       };

       function randomBoolArray() {
              let arr = [];
              for (let i = 0; i < 4; i++) {
                     arr.push(Math.random() < 0.5);
              }
              return arr;
       }

       function randomNumberAnswer() {
              return Math.floor(Math.random() * 4) + 1;
       }

       function getRandomAnswer() {
              return {
                     answers: randomBoolArray(),
                     questionNumber: randomNumberAnswer()
              }
       }
});