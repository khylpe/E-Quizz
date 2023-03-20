let mail = document.querySelector('#mail').innerHTML;
const db = new DataForResults(mail);
const maClasse = new Teacher();

document.querySelector('#sectionDisplayResults').style.display = "none";

db.fetchQuizzListFromResults().then(array => {
       if (array[0] == "error") {
              maClasse.tempMessage('error', array[1], '#tempMessage');
       } else if (array[0] == "success" && array[1].length > 0) {
              let liListe = maClasse.displayQuizzList(array, '#quizzList');
              if (liListe) {
                     liListe.forEach((nameInList) => {
                            nameInList.addEventListener('click', () => {
                                   document.querySelector('#dropdownButtonStudentGroup').classList.remove('disabled');
                                   document.querySelector('#quizzSelected').innerHTML = nameInList.innerHTML;
                                   db.setQuizzName(nameInList.innerHTML);

                                   db.fetchGroupListFromResults()
                                          .then(value => {
                                                 if (value[0] == "error") {
                                                        maClasse.tempMessage('error', value[1], '#tempMessage');
                                                 }
                                                 else if (value[0] == "success" && value[1].length > 0) {
                                                        let liList = maClasse.displayStudentGroups(value, '#groupsList');
                                                        if (liList) {
                                                               liList.forEach((groupInList) => {
                                                                      groupInList.addEventListener('click', () => {
                                                                             document.querySelector('#groupSelected').innerHTML = groupInList.innerHTML;
                                                                             db.setGroupName(groupInList.innerHTML);
                                                                             db.fetchDatesOfQuizzFromResults()
                                                                                    .then(value => {
                                                                                           if (value[0] == "error") {
                                                                                                  maClasse.tempMessage('error', value[1], '#tempMessage');
                                                                                                  document.querySelector('#dropdownButtonDates').classList.add('disabled');
                                                                                                  document.querySelector('#dateSelected').innerHTML = "Selectionner une date";
                                                                                           }
                                                                                           else if (value[0] == "success" && value[1].length > 0) {
                                                                                                  document.querySelector('#dropdownButtonDates').classList.remove('disabled');
                                                                                                  let liList = maClasse.displayDatesOfSelectedQuizz(value, '#datesList');
                                                                                                  if (liList) {
                                                                                                         liList.forEach((dateInList) => {
                                                                                                                dateInList.addEventListener('click', () => {
                                                                                                                       document.querySelector('#submitSeeResults').classList.remove('disabled');
                                                                                                                       document.querySelector('#dateSelected').innerHTML = dateInList.innerHTML;
                                                                                                                });
                                                                                                         });
                                                                                                  }
                                                                                           }
                                                                                           else {
                                                                                                  document.querySelector('#dropdownButtonDates').classList.add('disabled');
                                                                                                  maClasse.tempMessage('error', "Ce quizz n'a jamais été fait à cette classe", '#tempMessage');
                                                                                                  document.querySelector('#dateSelected').innerHTML = "Selectionner une date";
                                                                                           }
                                                                                    });
                                                                      });
                                                               });
                                                        }
                                                 } else {
                                                        maClasse.tempMessage('error', "Il n'y a pas de groupe enregistré", '#tempMessage');
                                                 }
                                          });
                            });
                     });
              }
       } else {
              maClasse.tempMessage('error', "Vous n'avez jamais fait de Quizz", '#tempMessage');
       }
});

document.querySelector('#seeResultsForm').addEventListener('submit', (e) => {
       e.preventDefault();
       document.querySelector('#sectionDisplayResults').style.display = "block";
       document.querySelector('#sectionSelectQuizz').style.display = "none";

       db.setQuizzName(document.querySelector('#quizzSelected').innerHTML);
       db.setGroupName(document.querySelector('#groupSelected').innerHTML);
       db.setQuizzTime(document.querySelector('#dateSelected').innerHTML);

       db.fetchQuestionsAndAnswers()
              .then(questionsReturned => {
                     if (questionsReturned[0] == "error") {
                            maClasse.tempMessage('error', questionsReturned[1], '#tempMessage');
                     }
                     else if (questionsReturned[0] == "success" && questionsReturned[1].length > 0) {
                            db.fetchQuizzResults(questionsReturned[1])
                                   .then(quizzResultsReturned => {
                                          maClasse.displayResults(questionsReturned[1], quizzResultsReturned[2], '#accordionResult')
                                   });
                     }
                     else {
                            maClasse.tempMessage('error', "Ce quizz n'a jamais été fait à cette classe", '#tempMessage');
                     }
              });
});

document.querySelector('#searchValue').addEventListener('input', (e) => {
       let searchValue = e.target.value;
       db.fetchStudentResults(searchValue);
});

