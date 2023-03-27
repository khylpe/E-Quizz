import FrontGlobal from "./FrontGlobal.js";

export default class FrontResults extends FrontGlobal {

       constructor() {
              super();
       }

       displayDatesOfSelectedQuizz(dates, selector) {
              let quizzList = document.querySelector(selector);
              quizzList.innerHTML = "";
              dates[1].forEach((date) => {
                     let li = document.createElement('li');
                     quizzList.appendChild(li);
                     let span = document.createElement('span');
                     span.classList = "dropdown-item";
                     span.id = "dateInList";
                     span.innerHTML = date;
                     li.appendChild(span);
                     let hr = document.createElement('hr');
                     hr.classList = "dropdown-divider quizzNameDivider";
                     quizzList.appendChild(hr);
              });

              // Remove the last divider // https://stackoverflow.com/a/5684878/19601188
              var nodes = quizzList.querySelectorAll('.quizzNameDivider');
              var last = nodes[nodes.length - 1];
              quizzList.removeChild(last);
              return document.querySelectorAll('#dateInList');
       }

       displayStudentResults(dataFromDB, selector) {
              dataFromDB[1].forEach((student, i) => {
                     let totalResult = 0;
                     let totalQuestions = 0;

                     let accordionItem = document.createElement('div');
                     accordionItem.classList = 'accordion-item border border-primary-subtle';
                     accordionItem.setAttribute('id', `accordionItem${i}`);

                     let studentHeader = document.createElement('h2');
                     studentHeader.classList = 'accordion-header';
                     accordionItem.appendChild(studentHeader);

                     let studentButton = document.createElement('button');
                     studentButton.classList = 'accordion-button collapsed';
                     studentButton.setAttribute('type', 'button');
                     studentButton.setAttribute('data-bs-toggle', 'collapse');
                     studentButton.setAttribute('data-bs-target', `#collapse${i}`);
                     studentButton.setAttribute('aria-expanded', 'false');
                     studentButton.setAttribute('aria-controls', `collapse${i}`);
                     studentButton.innerText = student.studentMail;
                     studentHeader.appendChild(studentButton);

                     let studentCollapse = document.createElement('div');
                     studentCollapse.classList = 'accordion-collapse collapse';
                     studentCollapse.setAttribute('id', `collapse${i}`);

                     accordionItem.appendChild(studentCollapse);

                     let studentBody = document.createElement('div');
                     studentBody.classList = 'accordion-body';

                     let table = document.createElement('table');
                     table.classList = 'table table-striped table-hover border-primary-subtle table-dark table-bordered table-responsive';
                     studentBody.appendChild(table);

                     let thead = document.createElement('thead');
                     table.appendChild(thead);

                     let tr = document.createElement('tr');
                     thead.appendChild(tr);

                     let th1 = document.createElement('th');
                     th1.setAttribute('scope', 'col');
                     th1.innerText = '#';
                     tr.appendChild(th1);

                     let th2 = document.createElement('th');
                     th2.setAttribute('scope', 'col');
                     th2.innerText = 'Quizz';
                     tr.appendChild(th2);

                     let th3 = document.createElement('th');
                     th3.setAttribute('scope', 'col');
                     th3.innerText = 'Classe';
                     tr.appendChild(th3);

                     let th4 = document.createElement('th');
                     th4.setAttribute('scope', 'col');
                     th4.innerText = 'Date';
                     tr.appendChild(th4);

                     let th5 = document.createElement('th');
                     th5.setAttribute('scope', 'col');
                     th5.innerText = 'Nombre de bonnes réponses';
                     tr.appendChild(th5);

                     let th6 = document.createElement('th');
                     th6.setAttribute('scope', 'col');
                     th6.innerText = 'Nombre de questions';
                     tr.appendChild(th6);

                     let th7 = document.createElement('th');
                     th7.setAttribute('scope', 'col');
                     th7.innerText = 'Score';
                     tr.appendChild(th7);                    

                     let tbody = document.createElement('tbody');
                     table.appendChild(tbody);

                     student.quizzResults.forEach((result, indexQuizz) => {
                            let tr = document.createElement('tr');
                            tbody.appendChild(tr);

                            let td1 = document.createElement('td');
                            td1.innerText = indexQuizz + 1;
                            tr.appendChild(td1);

                            let td2 = document.createElement('td');
                            td2.innerText = result.quizzName;
                            tr.appendChild(td2);

                            let td3 = document.createElement('td');
                            td3.innerText = result.groupName;
                            tr.appendChild(td3);

                            let td4 = document.createElement('td');
                            td4.innerText = result.date;
                            tr.appendChild(td4);

                            let td5 = document.createElement('td');
                            td5.innerText = result.numberOfGoodAnswer;
                            tr.appendChild(td5);

                            let td6 = document.createElement('td');
                            td6.innerText = result.numberOfQuestions;
                            tr.appendChild(td6);

                            let td7 = document.createElement('td');
                            td7.innerText = `${Math.round((result.numberOfGoodAnswer / result.numberOfQuestions) * 100)}%`;
                            tr.appendChild(td7);

                            totalResult += result.numberOfGoodAnswer;
                            totalQuestions += result.numberOfQuestions;
                     });

                     let finalResult = document.createElement('div');
                     finalResult.classList = 'accordion-body';
                     finalResult.innerHTML = `<h3 class="text-center">Score final : ${totalResult} / ${totalQuestions}, soit ${Math.round((totalResult / totalQuestions) * 100)}% de bonnes réponses</h3>`;
                     studentBody.appendChild(finalResult);

                     studentCollapse.appendChild(studentBody);
                     document.querySelector(selector).appendChild(accordionItem);
              });
       }
}