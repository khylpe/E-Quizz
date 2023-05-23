let mail = document.querySelector('#mail').innerHTML;

import BackResults from "./classes/back/BackResults.js";
import FrontResults from "./classes/front/FrontResults.js";

const Back = new BackResults(mail);
const Front = new FrontResults();

Back.fetchQuizzList().then(array => {
       if (array[0] == "error") {
              Front.tempMessage('error', array[1], '#tempMessage');
       } else if (array[0] == "success" && array[1].length > 0) {
              let liListe = Front.displayQuizzList(array, '#quizzList');
              if (liListe) {
                     liListe.forEach((nameInList) => {
                            nameInList.addEventListener('click', () => {
                                   document.querySelector('#dropdownButtonStudentGroup').classList.remove('disabled');
                                   document.querySelector('#dropdownButtonDates').classList.add('disabled');
                                   document.querySelector('#groupSelected').innerHTML = "Selectionner un groupe";
                                   document.querySelector('#dateSelected').innerHTML = "Selectionner une date";
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
                                                                             document.querySelector('#dateSelected').innerHTML = "Selectionner une date";

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
                                                                                                                       document.querySelector('#exportAsCSV').classList.remove('disabled');
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

document.querySelector('#submitSeeResults').addEventListener('click', async (e) => {
       e.preventDefault();
       await getResulstsAndDisplaySeletedQuizz(false);
       Front.scrollToLocation('#sectionDisplayResults');

});

document.querySelector('#studentMail').addEventListener('input', async (e) => {
       e.preventDefault();
       document.querySelector('#accordionResult').innerHTML = "";
       let searchValue = e.target.value;
       await Back.fetchStudentResults(searchValue).then(array => {
              if (array[0] == "error") {
                     Front.tempMessage('error', array[1], '#tempMessage');
              } else if (array[0] == "success" && array[1].length > 0) {
                     Front.displayStudentResults(array, '#accordionResult');
              } else {
                     Front.tempMessage('error', "Aucun résultat trouvé", '#tempMessage');
              }
       });
});

document.querySelector('#seeResultsByStudentForm').addEventListener('submit', (e) => { e.preventDefault(); });

document.querySelector('#exportAsCSV').addEventListener('click', (e) => {
       e.preventDefault();
       getResulstsAndDisplaySeletedQuizz(true)
});

document.querySelector('#scrollButton').addEventListener('click', (e) => {
       e.preventDefault();
       Front.scrollToLocation('#sectionSelectQuizzOrStudent');
});

function jsonToCsv(jsonData) {
       let header = "Eleves";
       let studentResults = {};

       jsonData.forEach((question) => {
              header += `;${question.question}`;

              question.answers.forEach((answer) => {
                     if (!studentResults[answer.studentMail]) {
                            studentResults[answer.studentMail] = [];
                     }

                     studentResults[answer.studentMail].push(answer.result ? "JUSTE" : "FAUX");
              });
       });

       let csvData = header + "\n";

       for (const [studentMail, results] of Object.entries(studentResults)) {
              csvData += `${studentMail};${results.join(";")}\n`;
       }

       return csvData;
}

function downloadCsv(csvData, fileName) {
       const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
       const link = document.createElement("a");
       const url = URL.createObjectURL(blob);

       link.setAttribute("href", url);
       link.setAttribute("download", fileName);
       link.style.visibility = "hidden";

       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
}


async function getResulstsAndDisplaySeletedQuizz(isForCSVFormat) {
       let arrayToSend = [];

       Back.setQuizzName(document.querySelector('#quizzSelected').innerHTML);
       Back.setGroupName(document.querySelector('#groupSelected').innerHTML);
       Back.setQuizzTime(document.querySelector('#dateSelected').innerHTML);

       await Back.fetchQuestionsAndAnswers()
              .then(async (questionsReturned) => {
                     if (questionsReturned[0] == "error") {
                            Front.tempMessage('error', questionsReturned[1], '#tempMessage');
                     }
                     else if (questionsReturned[0] == "success" && questionsReturned[1].length > 0) {
                            await Back.fetchQuizzResults().then(resultsReturned => {
                                   const arr = Object.values(resultsReturned[1]);

                                   if (resultsReturned[0] == "error") {
                                          Front.tempMessage('error', resultsReturned[1], '#tempMessage');
                                   }
                                   else if (resultsReturned[0] == "success" && arr.length > 0) {
                                          questionsReturned[1].forEach((question) => {
                                                 let answers = [];
                                                 arr.forEach((questionResult) => {
                                                        questionResult.forEach(result => {
                                                               if (question[3] == result.questionNumber) {
                                                                      answers.push({ "studentMail": result.studentMail, "studentAnswer": result.answerSubmitted, "result": result.result });
                                                               }
                                                        })
                                                 });
                                                 arrayToSend.push({ 'question': question[0], 'questionNumber': question[3], 'answers': answers });
                                          });
                                          if (isForCSVFormat) {
                                                 downloadCsv(jsonToCsv(arrayToSend), `${document.querySelector('#quizzSelected').innerHTML}_${document.querySelector('#groupSelected').innerHTML}_${document.querySelector('#dateSelected').innerHTML}.csv`);
                                          } else {
                                                 Front.displayResults(arrayToSend, '#accordionResult');
                                          }
                                   }
                                   else {
                                          Front.tempMessage('error', "Ce quizz n'a jamais été fait à cette classe", '#tempMessage');
                                   }
                            });
                     }
                     else {
                            Front.tempMessage('error', "Ce quizz n'a jamais été fait à cette classe", '#tempMessage');
                     }
              });
}