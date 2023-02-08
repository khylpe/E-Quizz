const socket = io("http://10.69.88.32:8100", { transports: ["websocket"] });

let formulaireMail = document.querySelector('#formulaireMail');
let divMessageErreur = document.querySelector('#messageErreur');
let divButtons = document.querySelector('#divButtons');
divButtons.hidden = true;
let btnReturnHome = document.querySelector('#btnHome');
let btnModify = document.querySelector('#btnModify');
let btnAnswers = document.querySelectorAll('#btnAnswers button');
let inputs = document.querySelectorAll('#btnAnswers input[type="checkbox"]');
let submitToTeacher = document.querySelector('#btnValidate');
let corriger = document.querySelector('#btnModify');

for (let i = 0; i < btnAnswers.length; i++) { // changement couleur une fois cliqué + ckeck / uncheck checkbox
    inputs[i].checked = false;
    btnAnswers[i].addEventListener('click', (ElementDuDOM) => {
        if ((ElementDuDOM.target.classList).contains('btn-primary')) {
            ElementDuDOM.target.classList = "btn btn-outline-primary p-4";
            inputs[i].checked = false;
        } else {
            ElementDuDOM.target.classList = "btn btn-primary p-4";
            inputs[i].checked = true;
        }
    })
}

socket.on('connect', () => {
    socket.on('studentRegistered', () => {
        divMessageErreur.innerHTML = "";
        formulaireMail.hidden = true;
        divButtons.hidden = false;
        btnModify.hidden = true;
    });

    socket.on('doublons', () => {
        divMessageErreur.innerHTML = "Vous êtes déjà enregistré";
    });

    socket.on('teacherNotConnected', () => {
        divMessageErreur.innerHTML = "teacher as not connected";
    });

    socket.on('sessionCreated', (createSession) => {
        console.log(createSession);
    });

    socket.on('getAnswers', () => {
        socket.emit('studentAnswers', {
            answers: getAnswers()
        })
        btnAnswers.forEach((button, index) => {
            button.classList = "btn btn-outline-primary p-4";
            inputs[index].checked = false;
        });
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

formulaireMail.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputMail = document.querySelector('#mailAddress');
    socket.emit('studentVerificated', inputMail.value);
    inputMail.value = "";
});

submitToTeacher.addEventListener('click', () => { //bouton valider QCM
    submitToTeacher.hidden = true;
    btnModify.hidden = false;
    btnAnswers.forEach((element) => {
        element.classList += " disabled";
    });
    socket.emit('questionAnswered');
});

corriger.addEventListener('click', () => { //bouton corriger QCM
    submitToTeacher.hidden = false;
    btnModify.hidden = true;
    btnAnswers.forEach((element) => {
        element.classList.remove("disabled");
    });
})

btnReturnHome.addEventListener('click', () => { //bouton Home QCM
    socket.emit('studentDisconnect', () => {
    })
    formulaireMail.hidden = false;
    divButtons.hidden = true;
    btnAnswers.forEach((element, index) =>{
        element.classList ="btn btn-outline-primary p-4";
        inputs[index].checked = false;
        console.log("boutton" + element)
        console.log("inputs" + inputs[index])
    });
})

/////////////////////////////////////////////////////////////////////////////////////////////////

function getAnswers() {
    let arrayAnswers = [];
    for (let a = 0; a < inputs.length; a++) {
        arrayAnswers.push(inputs[a].checked);
    }
    return arrayAnswers;
     console.log(arrayAnswers);
}