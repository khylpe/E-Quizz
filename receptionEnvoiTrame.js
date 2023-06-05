import { io } from "socket.io-client";
import { SerialPort } from "serialport";
import { ReadlineParser } from '@serialport/parser-readline'
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });

const socket = io("http://192.168.0.254:8100", {
	transports:
		["websocket"],
	query: {
		status: 'boitier'
	}
});

const parser = port.pipe(new ReadlineParser({ delimiter: '!' }));

let studentsAnswers = [];

socket.on("connect", () => {
	// Quand on recoie des données : 
	console.log("connected");
});

socket.on("disconnect", () => {
	// Quand on recoie des données : 
	console.log("disconnected");
});

socket.on('getStudentsAnswers', (callback) => {
	console.log("students answers before sending it (should be the same than after): ");
	callback(studentsAnswers);
});

socket.on("questionNumber", (questionNumber) => {
	// port.write({ questionNumber: questionNumber });
	console.log("Question number is : ", questionNumber);
});

parser.on('data', (data) => {
       console.log('Data:', data);
	let trameComplete = "";

	let traduit = hex2a(data);

	if (traduit[0] == "$") {
		trameComplete = traduit;
	}
	else {
		trameComplete += traduit;
	}

	if (trameComplete.includes("!")) {
		console.log("truc ajouté : ", traitertrame(trameComplete))
		studentsAnswers.push(traitertrame(trameComplete));
	}
});

/////////////////////////////////////////////////////////////////
function traitertrame(trame) {

	let numBoitier = trame[1] + trame[2];
	let numQuestion = trame[3] + trame[4];

	let choixDeReponse = trame[5];

	let i = 6;
	while (trame[i] != "!") {
		choixDeReponse += trame[i];
		i++;
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
//////////////////////////////////////////////////////////////////////////////