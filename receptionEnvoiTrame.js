////////////////////
//Execution :		node exemple2.js
//////////////////////////
const socket = io("http://192.168.0.254:8100", {
	transports:
		["websocket"],
	query: {
		status: 'boitier'
	}
})
import { io } from "socket.io-client";
import { SerialPort } from "serialport";

const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });


socket.on("connect", () => {
	// Quand on recoie des données : 
	let trameComplete = "";

	port.on('data', (data) => {
		// ICI ON FAIT CE QU'ON VEUT
		let traduit = hex2a(data);

		if (traduit[0] == "$") {
			trameComplete = traduit;
		}
		else {
			trameComplete += traduit;
		}

		if (trameComplete.includes("!")) {
			socket.emit("trameComplete", traitertrame(trameComplete));

		}

	});
// Envoyer des données : 
	socket.on('test', data => {
		console.log(data);
		port.write(`${data}\n`);

	})
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