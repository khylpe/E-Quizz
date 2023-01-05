var socket = io();

let buttonSendAnswer = document.getElementById("send");
buttonSendAnswer.addEventListener("click", () => {
       socket.emit("answer");
});

socket.on('new answer', (numberOfAnswers) => {
       document.getElementById("compteur").innerHTML = numberOfAnswers;
});

document.querySelector('#startSession').addEventListener('click', () => {
       socket.emit('startSession');
});