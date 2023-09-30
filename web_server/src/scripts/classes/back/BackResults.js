import BackGlobal from "./BackGlobal.js";

export default class BackResults extends BackGlobal {
       
       constructor(mail) {
              super();
              this.mail = mail;
       }

       async fetchQuizzList() {
              return await fetch('/src/php/fetchQuizzListFromResults.php', {
                     method: 'POST',
                     body: JSON.stringify({
                            teacherMail: this.mail
                     })
              })
                     .then(result => result.json())
                     .then(array => {
                            return array;
                     })
       }

       async fetchGroupList() {
              return await fetch('/src/php/fetchGroupListFromResults.php', {
                     method: 'POST',
                     body: JSON.stringify({
                            teacherMail: this.mail,
                            quizzName: this.quizzName
                     })
              })
                     .then(result => result.json())
                     .then(array => {
                            return array;
                     })
       }

       async fetchDatesOfQuizz() {
              return await fetch('/src/php/fetchDatesOfQuizzFromResults.php', {
                     method: 'POST',
                     body: JSON.stringify({
                            teacherMail: this.mail,
                            quizzName: this.quizzName,
                            studentGroup: this.groupName
                     })
              })
                     .then(result => result.json())
                     .then(array => {
                            return array;
                     })
       }

       async fetchQuizzResults() {
              return await fetch('/src/php/fetchQuizzResults.php', {
                     method: 'POST',
                     body: JSON.stringify({
                            teacherMail: this.mail,
                            quizzName: this.quizzName,
                            studentGroup: this.groupName,
                            date: this.quizzTime
                     })
              })
                     .then(result => result.json())
                     .then(array => {
                            return array
                     })
                     .catch(err => {
                            return Array('error', err);
                     });
       }

       async fetchStudentResults(studentMail) {
              return await fetch('/src/php/fetchStudentResults.php', {
                     method: 'POST',
                     body: new String(studentMail)
              })
                     .then(result => result.json())
                     .then(array => {
                            return array;
                     })
       }
}