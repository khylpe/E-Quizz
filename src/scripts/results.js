let mail = document.querySelector('#mail').innerHTML;

import BackResults from "./classes/back/BackResults.js";
import FrontResults from "./classes/front/FrontResults.js";

const Back = new BackResults(mail);
const Front = new FrontResults();

document.querySelector('#sectionDisplayResults').style.display = "none";

Back.fetchQuizzList().then(array => {
       if (array[0] == "error") {
              Front.tempMessage('error', array[1], '#tempMessage');
       } else if (array[0] == "success" && array[1].length > 0) {
              let liListe = Front.displayQuizzList(array, '#quizzList');
              if (liListe) {
                     liListe.forEach((nameInList) => {
                            nameInList.addEventListener('click', () => {
                                   document.querySelector('#dropdownButtonStudentGroup').classList.remove('disabled');
                                   document.querySelector('#quizzSelected').innerHTML = nameInList.innerHTML;
                                   Back.setQuizzName(nameInList.innerHTML);

                                   Back.fetchGroupList()
                                          .then(value => {
                                                 if (value[0] == "error") {
                                                        Front.tempMessage('error', value[1], '#tempMessage');
                                                 }
                                                 else if (value[0] == "success" && value[1].length > 0) {
                                                        let liList = Front.displayStudentGroups(value, '#groupsList');
                                                        if (liList) {
                                                               liList.forEach((groupInList) => {
                                                                      groupInList.addEventListener('click', () => {
                                                                             document.querySelector('#groupSelected').innerHTML = groupInList.innerHTML;
                                                                             Back.setGroupName(groupInList.innerHTML);
                                                                             Back.fetchDatesOfQuizz()
                                                                                    .then(value => {
                                                                                           if (value[0] == "error") {
                                                                                                  Front.tempMessage('error', value[1], '#tempMessage');
                                                                                                  document.querySelector('#dropdownButtonDates').classList.add('disabled');
                                                                                                  document.querySelector('#dateSelected').innerHTML = "Selectionner une date";
                                                                                           }
                                                                                           else if (value[0] == "success" && value[1].length > 0) {
                                                                                                  document.querySelector('#dropdownButtonDates').classList.remove('disabled');
                                                                                                  let liList = Front.displayDatesOfSelectedQuizz(value, '#datesList');
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
                                                                                                  Front.tempMessage('error', "Ce quizz n'a jamais été fait à cette classe", '#tempMessage');
                                                                                                  document.querySelector('#dateSelected').innerHTML = "Selectionner une date";
                                                                                           }
                                                                                    });
                                                                      });
                                                               });
                                                        }
                                                 } else {
                                                        Front.tempMessage('error', "Il n'y a pas de groupe enregistré", '#tempMessage');
                                                 }
                                          });
                            });
                     });
              }
       } else {
              Front.tempMessage('error', "Vous n'avez jamais fait de Quizz", '#tempMessage');
       }
});

document.querySelector('#seeResultsForm').addEventListener('submit', (e) => {
       e.preventDefault();
       document.querySelector('#sectionDisplayResults').style.display = "block";
       document.querySelector('#sectionSelectQuizz').style.display = "none";

       Back.setQuizzName(document.querySelector('#quizzSelected').innerHTML);
       Back.setGroupName(document.querySelector('#groupSelected').innerHTML);
       Back.setQuizzTime(document.querySelector('#dateSelected').innerHTML);

       Back.fetchQuestionsAndAnswers()
              .then(questionsReturned => {
                     if (questionsReturned[0] == "error") {
                            Front.tempMessage('error', questionsReturned[1], '#tempMessage');
                     }
                     else if (questionsReturned[0] == "success" && questionsReturned[1].length > 0) {
                            Back.fetchQuizzResults(questionsReturned[1])
                                   .then(quizzResultsReturned => {
                                          Front.displayResults(questionsReturned[1], quizzResultsReturned[2], '#accordionResult')
                                   });
                     }
                     else {
                            Front.tempMessage('error', "Ce quizz n'a jamais été fait à cette classe", '#tempMessage');
                     }
              });
});

document.querySelector('#searchValue').addEventListener('input', (e) => {
       let searchValue = e.target.value;
       Back.fetchStudentResults(searchValue).then(array => {
              if (array[0] == "error") {
                     Front.tempMessage('error', array[1], '#tempMessage');
              } else if (array[0] == "success" && array[1].length > 0) {
                     Front.displayStudentResults(array, '#accordionResult');
              } else {
                     Front.tempMessage('error', "Aucun résultat trouvé", '#tempMessage');
              }
       });
});