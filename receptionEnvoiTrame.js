import { io } from "socket.io-client";
import { SerialPort } from "serialport";
import { ReadlineParser } from '@serialport/parser-readline'
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
let studentsAnswers = [];

const socket = io("http://192.168.0.254:8100", {
       transports:
              ["websocket"],
       query: {
              status: 'boitier'
       }
});

const parser = port.pipe(new ReadlineParser({ delimiter: '!' }));
let currentQuestion = 1;

port.on('data', (data) => {
       console.log('Data:', data.toString());
});

parser.on('data', (trame) => {
       trame = trame.toString();
       let startOfTrame = trame.indexOf("$");
       let onlyData = trame.slice(startOfTrame + 1, trame.length);
       console.log("trame traduite avec uniquement les données : ", onlyData);
       addToArray(traitertrame(onlyData));
});

socket.on("connect", () => {
       console.log("connected");
});

socket.on("questionNumber", (questionNumber) => {
       currentQuestion = questionNumber;
       console.log("currentQuestion : ", currentQuestion);
       port.write("$0" + currentQuestion + "!");
});

// socket.on('getStudentsAnswers', () => {
//        socket.emit('answers', studentsAnswers);
// });

socket.on('getStudentsAnswers', (jsonContainNumberQuestion, callback) => {
       console.log('studentsAnswers : ', studentsAnswers);
       // encode to json
       let json = JSON.stringify(studentsAnswers);
       callback(json);
});

socket.on("disconnect", () => {
       console.log("socket disconnected");
});

function traitertrame(trame) {
       console.log("we are in the function traitertrame");
       let numBoitier = trame[0] + trame[1];
       let numQuestion = trame[2] + trame[3];

       let choixDeReponse = trame[4];
       for (let i = 5; i < trame.length; i++) {
              choixDeReponse += trame[i];
       }

       console.log("Trame complète", trame);
       console.log('numBoitier : ', numBoitier);
       console.log('numQuestion : ', numQuestion);
       console.log('choixDeRéponse : ', choixDeReponse);
       console.log('----------------------------');

       let tabOfAnswersAsBoolean = [false, false, false, false];
       if (choixDeReponse.includes("A"))
              tabOfAnswersAsBoolean[0] = true;

       if (choixDeReponse.includes("B"))
              tabOfAnswersAsBoolean[1] = true;

       if (choixDeReponse.includes("C"))
              tabOfAnswersAsBoolean[2] = true;

       if (choixDeReponse.includes("D"))
              tabOfAnswersAsBoolean[3] = true;

       choixDeReponse = tabOfAnswersAsBoolean;

       console.log("we are in the function traitertrame, value of numBoitier : ", numBoitier);
       console.log("we are in the function traitertrame, value of numQuestion : ", numQuestion);
       console.log("we are in the function traitertrame, value of choixDeReponse : ", choixDeReponse);


       return {
              numBoitier: numBoitier,
              numQuestion: currentQuestion,
              answers: choixDeReponse,
       };
}

function addToArray(trame) {
       // Check if the trame is already in the array
       console.log("we are in the function addToArray, value of trame : ", trame)
       for (let i = 0; i < studentsAnswers.length; i++) {
              if (studentsAnswers[i].numBoitier == trame.numBoitier && studentsAnswers[i].numQuestion == trame.numQuestion) {
                     studentsAnswers[i].choixDeReponse = trame.choixDeReponse;
                     return;
              }
       }
       studentsAnswers.push(trame);
}