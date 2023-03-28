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
                     body: JSON.stringify({ mail: this.mail, quizzTitle: this.quizzName, questionsAndAnswers: questionsAndAnswers })
              })
                     .then(result => result.json())
                     .then(array => {
                            return Array(array[0], array[1]);
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