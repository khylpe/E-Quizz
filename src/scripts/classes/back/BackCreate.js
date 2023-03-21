import BackGlobal from "./BackGlobal.js";

export default class BackCreate extends BackGlobal {
       mail;
       constructor(mail) {
              super();
              this._back = new BackGlobal();
              this.mail = mail;
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
}