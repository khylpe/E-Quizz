class teacher{
       constructor(mail){
              this.mail = mail;
              this.fetchData = new FetchDataFromDB(mail);
              this.manageFront = new ManageFront();
              this.socketIO = io('http://localhost:8100/', { transports: ["websocket"] });
       }
              
       createSession(quizzName, groupName){
              if (quizzName != "Selectionner un quizz" && groupName != "Selectionner un groupe" && quizzName != null && groupName != null ) {
                     maClasse.socketIO.emit('createSession', {quizzName : quizzName, groupName : groupName, mail : this.mail});
              }
       }

       resetSession(){
              this.socketIO.emit('resetSession');
       }
}