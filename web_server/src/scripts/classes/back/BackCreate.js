import BackGlobal from "./BackGlobal.js";

export default class BackCreate extends BackGlobal {
       constructor(mail) {
              super();
              this._back = new BackGlobal();
              this.mail = mail;
       }
       
       async checkIfQuizzNameIsAvailable(quizzName) {
              return fetch('/src/php/checkIfQuizzNameIsAvailable.php', {
                     method: 'POST',
                     body: JSON.stringify({ quizzName: quizzName})
              })
                     .then(result => result.json())
                     .then(array => {
                            return Array(array[0], array[1]);
                     })
                     .catch(err => {
                            return Array('error', err);
                     });
       }

       async createQuizz(quizzName, questionsAndAnswers, quizzNumber) {
              return await fetch('/src/php/createQuizz.php', {
                     method: 'POST',
                     body: JSON.stringify({ mail: this.mail, quizzTitle: quizzName, questionsAndAnswers: questionsAndAnswers, quizzNumber : quizzNumber })
              })
                     .then(result => result.json())
                     .then(typeAndMessage => { // typeAndMessage = [type, message] // type = 'success' or 'error'
                            return typeAndMessage;
                     })
                     .catch(errValue => {
                            return Array('error', errValue);
                     });
       }

       async createQuizzNumber() {
              return await fetch('/src/php/createQuizzNumber.php', {
              })
                     .then(result => result.json())
                     .then(array => {
                            return array;
                     })
                     .catch(err => {
                            return Array('error', err);
                     });
       }

       async modifyQuizz(quizzName, questionsAndAnswers, quizzNumber) {
              return await fetch('/src/php/modifyQuizz.php', {
                     method: 'POST',
                     body: JSON.stringify({ mail: this.mail, quizzTitle: quizzName, questionsAndAnswers: questionsAndAnswers, quizzNumber : quizzNumber })
              })
                     .then(result => result.json())
                     .then(array => {
                            return Array(array[0], array[1]);
                     })
                     .catch(err => {
                            return Array('error', err);
                     });
       }
}