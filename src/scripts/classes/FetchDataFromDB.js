class FetchDataFromDB {
       constructor(mail) {
              this.mail = mail;
       }
       
       fetchQuizzList() {
              return fetch('/src/php/fetchQuizzList.php', {
                     method: 'POST',
                     body: new String(this.mail)
              })
                     .then(result => result.json())
                     .then(array => {
                            if (array[0] == "success") {
                                   if (array[1].length > 0) {
                                          return Array('sucessful', array[1]);
                                   }
                                   else {
                                          return Array('error', 'Vous devez créer un quizz avant de pouvoir créer une session');
                                   }
                            } else {
                                   return Array('error', 'Une erreur est survenue lors de la récupération de la liste des quizz : ' +  array[1]);
                            }
                     })
                     .catch(err => {
                            return Array('error', err);
                     });                   
       }

       fetchStudentGroups() {
              return fetch('/src/php/fetchGroupsList.php')
                     .then(result => result.json())
                     .then(array => {
                            if (array[0] == "success") {
                                   if (array[1].length > 0) {
                                          return Array('sucessful', array[1]);
                                   }
                                   else {
                                          return Array('error', "Il n'y a pas de groupe d'étudiants enregistré");
                                   }
                            } else {
                                   return Array('error', "Une erreur est survenue lors de la récupération de la liste des groupes d'étudiants : " +  array[1]);
                            }
                     })
                     .catch(err => {
                            return Array('error', err);
                     }); 
              
       }
}