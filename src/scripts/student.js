const socket = io("http://192.168.1.35:8100", { transports: ["websocket"] });

let monForm = document.querySelector('form');
let allReadyConnect = document.querySelector('#student');
let home = document.querySelector('#btnHome');
let maDiv = document.querySelector('#maDiv');
let buttonCorrect = document.querySelector('#btnCor');
maDiv.hidden = true;


monForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let monInput = document.querySelector('#mailAddress');
    socket.emit('studentVerificated', monInput.value);
    monInput.value = "";

    // for (let i = 0; i < document.querySelectorAll('#answers button').length; i++) {
    //     console.log(document.querySelectorAll('#answers button')[i]);
    //     document.querySelectorAll('#answers button')[i].addEventListener('click', demo);
    // }
});

socket.on('connect', () => {
    socket.on('studentRegistered', () => {
        allReadyConnect.innerHTML = "";
        monForm.hidden = true;
        maDiv.hidden = false;
        buttonCorrect.hidden = true;
    });
    socket.on('doublons', () => {
        allReadyConnect.innerHTML = "Vous êtes déjà enregistré";
    });
});

socket.on('teacherNotConnected', () => {
    let connectionTeacher = document.querySelector('#teacherNotConnect');
    connectionTeacher.innerHTML = "teacher as not connected";
});

socket.on('sessionCreated', (createSession) => {
    console.log(createSession);
});

let tab = [];

// solution 1 :
for (let i = 0; i < document.querySelectorAll('#answers button').length; i++) {

    document.querySelectorAll('#answers button')[i].addEventListener('click', (ElementDuDOM) => {

        if ((ElementDuDOM.target.classList).contains('btn-primary')) {
            console.log(ElementDuDOM.target.classList = "btn btn-outline-primary");
            ElementDuDOM.target.classList = "btn btn-outline-primary";
            let maVariable = document.querySelectorAll('#answers button')[i];
            console.log(ElementDuDOM.target.innerHTML);
            tab.splice(ElementDuDOM.target.innerHTML, 1);
            // tab.remove('maVariable');
            console.log("Mon tableau: " + tab)




        } else {
            ElementDuDOM.target.classList = "btn btn-primary";
            tab.push(ElementDuDOM.target.innerHTML);
        }
    })
}

// solution 2 :
// document.querySelectorAll('#answers button').forEach((element) => {
//     element.addEventListener('click', (aa) => {
//         if ((aa.target.classList).contains('btn-primary')) {
//             aa.target.classList = "btn btn-outline-primary";
//             // remove from tab
//         } else {
//             aa.target.classList = "btn btn-primary";
//             tab.push(aa.target.innerHTML);
//         }
//     })
// })

// solution 3 :
// function demo(elementClique) {
//     console.log(elementClique);
//     if ((elementClique.target.classList).contains('btn-primary')) {
//         elementClique.target.classList = "btn btn-outline-primary";
//         // remove from tab
//     } else {
//         elementClique.target.classList = "btn btn-primary";
//         tab.push(elementClique.target.innerHTML);
//         console.log(tab);
//     }
// }


let submitToTurtur = document.querySelector('#btnVal');  //Validate QCM
submitToTurtur.addEventListener('click', () => {
    console.log(tab);
    socket.emit('coucouArthurJeSuisArrive', {
        reponse: tab
    });

    // buttonCorrect.hidden = false;
    // submitToTurtur.hidden = true;
});

// });