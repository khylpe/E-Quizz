class DB {
       groupName;
       quizzName;
       quizzTime;
       mail
       
       constructor(mail) {
              this.mail = mail;
       }

       async fetchQuizzList() {
              return await fetch('/src/php/fetchQuizzList.php', {
                     method: 'POST',
                     body: new String(this.mail)
              })
                     .then(result => result.json())
                     .then(array => {
                            if (array[0] == "success") {
                                   if (array[1].length > 0) {
                                          return Array('success', array[1]);
                                   }
                                   else {
                                          return Array('error', 'Vous devez créer un quizz avant de pouvoir créer une session');
                                   }
                            } else {
                                   return Array('error', 'Une erreur est survenue lors de la récupération de la liste des quizz : ' + array[1]);
                            }
                     })
                     .catch(err => {
                            return Array('error', err);
                     });
       }

       async fetchStudentGroups() {
              return await fetch('/src/php/fetchGroupsList.php')
                     .then(result => result.json())
                     .then(array => {
                            if (array[0] == "success") {
                                   if (array[1].length > 0) {
                                          return Array('success', array[1]);
                                   }
                                   else {
                                          return Array('error', "Il n'y a pas de groupe d'étudiants enregistré");
                                   }
                            } else {
                                   return Array('error', "Une erreur est survenue lors de la récupération de la liste des groupes d'étudiants : " + array[1]);
                            }
                     })
                     .catch(err => {
                            return Array('error', err);
                     });
       }

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

       async createQuizz(questionsAndAnswers) {
              return await fetch('/src/php/createQuizz.php', {
                     method: 'POST',
                     body: JSON.stringify({ mail: this.mail, quizzTitle: quizzTitle, questionsAndAnswers: questionsAndAnswers })
              })
                     .then(result => result.json())
                     .then(array => {
                            return Array(array[0], array[1]);
                     })
                     .catch(err => {
                            return Array('error', err);
                     });
       }

       async insertResult(studentMail, questionNumber, studentAnswers, resultQuestion) {
              return await fetch('/src/php/insertResult.php', {
                     method: 'POST',
                     body: JSON.stringify({
                            teacherMail: this.mail,
                            studentMail: studentMail,
                            groupName: this.groupName,
                            quizzTitle: this.quizzName,
                            questionNumber: questionNumber,
                            studentAnswers: studentAnswers,
                            resultQuestion: resultQuestion,
                            time: this.quizzTime
                     })
              })
                     .then(result => result.json())
                     .then(array => {
                            return Array(array[0]);
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