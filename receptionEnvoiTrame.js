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

parser.on('data', (data) => {
    console.log('Data:', data);
	let traduit = hex2a(data);
    let startOfTrame = traduit.indexOf("$");
    let onlyData = traduit.slice(startOfTrame+1, traduit.length);
    console.log("trame traduite propre : ", onlyData);
	studentsAnswers.push(traitertrame(onlyData));
});

socket.on("connect", () => {
	console.log("connected");
});

socket.on("questionNumber", (questionNumber) => {
	// port.write({ questionNumber: questionNumber });
	console.log("Question number is : ", questionNumber);
});

socket.on('getStudentsAnswers', (callback) => {
	callback(studentsAnswers);
});

socket.on("disconnect", () => {
	// Quand on recoie des données : 
	console.log("disconnected");
});

/////////////////////////////////////////////////////////////////

function traitertrame(trame) {
	let numBoitier = trame[0] + trame[1];
	let numQuestion = trame[2] + trame[3];

	let choixDeReponse = trame[4];
	for (let i = 5 ; trame[i] != "V" ; i++) {
		if(trame[i] != "V")
			choixDeReponse += trame[i];
	}

	console.log("Trame complète", trame);
	console.log('numBoitier : ', numBoitier);
	console.log('numQuestion : ', numQuestion);
	console.log('choixDeRéponse : ', choixDeReponse);
	console.log('----------------------------');

	return {
		numBoitier: numBoitier,
		numQuestion: numQuestion,
		choixDeReponse: choixDeReponse,
	};
}

///////////////////////////////////////////////////////////////////////////////
function hex2a(hexx) {
	return hexx.toString();
};