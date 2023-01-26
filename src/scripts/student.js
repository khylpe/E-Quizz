const socket = io("http://10.69.88.32:8100", { transports: ["websocket"] });

let monForm = document.querySelector('form');


monForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let monInput = document.querySelector('#mailAddress');
    socket.emit('studentVerificated', monInput.value);
    monInput.value="";
});


socket.on('connect', () =>{
    socket.on('studentRegistered', () => {
        //let cacher = monForm.hidden = true;
       console.log("on est enregistré");
    });
    socket.on('doublons', () => {                     
       let coucou = document.querySelector('#student');
       coucou.innerHTML="Vous êtes déjà enregistré";
    });
});

socket.on('teacherNotConnected', () =>{
    let sss = document.querySelector('#teacherNotConnect');
    sss.innerHTML="teacher as not connected";
});

socket.on('sessionCreated', (dftgyh)=>{
console.log(dftgyh);
})





//Teacher disconnect




// btnSwitch.addEventListener("click", ()=>{
    
// });

// let maDiv = document.querySelector('#laDiv');
// let btnReturnToHome = document.querySelector('#home');
// btnReturnToHome.addEventListener("click", ()=>{
//     let hidde = maDiv.hidden = true;
// });