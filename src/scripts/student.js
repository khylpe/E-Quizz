const socket = io();

let monForm = document.querySelector('form');

monForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let monInput = document.querySelector('#mailAddress');
    socket.emit('studentRegistered', monInput.value);
    monInput.value="";
});


socket.on('connect', () =>{
    socket.on('doublons', () => {                     
       let coucou = document.querySelector('#student');
       coucou.innerHTML="Vous etes enregistré";
    });
});

socket.on('teacherNotConnected', () =>{
    let sss = document.querySelector('#teacherNotConnect');
    sss.innerHTML="teacher as not connected";
});

socket.on('sessionCreated', (dftgyh)=>{
console.log(dftgyh);
})
