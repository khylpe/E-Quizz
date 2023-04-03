import BackGlobal from "./BackGlobal.js";

export default class BackSession extends BackGlobal {
       constructor(mail) {
              super();
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
}