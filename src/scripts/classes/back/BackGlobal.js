console.log('global')
export default class BackGlobal {       
       async fetchQuestionsAndAnswers() {
              return await fetch('/src/php/fetchQuestionsAndAnswers.php', {
                     method: 'POST',
                     body: JSON.stringify({
                            quizzName: this.quizzName,
                            author: this.mail
                     })
              })
                     .then(result => result.json())
                     .then(array => {
                            if (array[0] == "success") {
                                   return Array('success', array[1]);
                            } else {
                                   return Array('error', "Une erreur est survenue lors de la récupération des questions et réponses : " + array[1]);
                            }
                     })
                     .catch(err => {
                            return Array('error', err);
                     });
       }      
       
       setGroupName(groupName) {
              this.groupName = groupName;
       }

       setQuizzTime(quizzTime) {
              this.quizzTime = quizzTime;
       }

       setQuizzName(quizzName) {
              this.quizzName = quizzName;
       }
}