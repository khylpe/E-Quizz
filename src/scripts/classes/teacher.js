class teacher{
       constructor(mail){
              this.mail = mail;
       }
       tempMessage(type, message, selector) { // type = "error" or "success"
              if (!message) return;
              if (type == "error") {
                     type = "alert alert-danger";
              } else if (type == "success") {
                     type = "alert alert-success";
              } else {
                     return;
              }

              let tempMessage = document.querySelector(selector);
              tempMessage.innerHTML = message;
              tempMessage.classList = 'text-center container ' + type;
              tempMessage.style.display = "block";
              setTimeout(() => {
                     tempMessage.style.display = "none";
              }, 18000);
       }

       displayQuizzList(data, selector) { /* [0] = error or success, [1] = quizzListTitles[] || error message */
              if (data[0] == "error") {
                     this.tempMessage('error', data[1]);
                     return false;
              } else if (data[0] == "success" && data[1].length > 0) {
                     let quizzList = document.querySelector(selector);
                     quizzList.innerHTML = "";
                     data[1].forEach((quizzName) => {
                            let li = document.createElement('li');
                            quizzList.appendChild(li);
                            let span = document.createElement('span');
                            span.classList = "dropdown-item";
                            span.id = "quizzInList";
                            span.innerHTML = quizzName;
                            li.appendChild(span);
                            let hr = document.createElement('hr');
                            hr.classList = "dropdown-divider quizzNameDivider";
                            quizzList.appendChild(hr);
                     });

                     // Remove the last divider // https://stackoverflow.com/a/5684878/19601188
                     var nodes = quizzList.querySelectorAll('.quizzNameDivider');
                     var last = nodes[nodes.length - 1];
                     quizzList.removeChild(last);                    
                     return document.querySelectorAll('#quizzInList');
              } else {
                     this.tempMessage('error', "Il n'y a pas de quizz enregistré");
                     return false;
              }
       }

       displayStudentGroups(data, selector) { /* [0] = error or success, [1] = studentGroups[] || error message */
              if (data[0] == "error") {
                     this.tempMessage('error', data[1]);
                     return false;
              }
              else if (data[0] == "success" && data[1].length > 0) {
                     let groupsList = document.querySelector(selector);

                     data[1].forEach((groupName) => {
                            let li = document.createElement('li');
                            groupsList.appendChild(li);
                            let span = document.createElement('span');
                            span.classList = "dropdown-item";
                            span.id = "groupInList";
                            span.innerHTML = groupName;
                            li.appendChild(span);
                            let hr = document.createElement('hr');
                            hr.classList = "dropdown-divider groupsNameDivider";
                            groupsList.appendChild(hr);
                     });

                     // Remove the last divider // https://stackoverflow.com/a/5684878/19601188
                     var nodes = groupsList.querySelectorAll('.groupsNameDivider');
                     var last = nodes[nodes.length - 1];
                     groupsList.removeChild(last);

                     return document.querySelectorAll('#groupInList')
               }
              else {
                     this.tempMessage('error', "Il n'y a pas de groupe enregistré");
                     return false;
              }
       }       

       changeCurrentSection(sectionToDisplay) {
              document.querySelectorAll('section').forEach((section) => {
                     section.style.display = "none";
              });
              document.querySelector(`#${sectionToDisplay}`).style.display = "block";
       }

       getCurrentSection() {
              return document.querySelector('section:not([style*="display: none"])'); // https://stackoverflow.com/a/39813096/19601188
       }

       updateSessionInformations(data) {
              let status;
              if (data.sessionStatus == "notConnected")
                     status = "Pas connecté";
              else if (data.sessionStatus == "SessionStatus")
                     status = "Session créée, en attente de démarrage";
              else if (data.sessionStatus == "SessionStarted")
                     status = "Session démarrée";
              else if (data.sessionStatus == "SessionEnded")
                     status = "Session terminée";
              else if (data.sessionStatus == "SessionClosed")
                     status = "Session fermée";
              else
                     status = "Session inconnue";

              document.querySelector('#sessionStatusInfo').innerHTML = `Status de la session : ${status}`;
              document.querySelector('#teacherInfo').innerHTML = `Enseignant : ${data.teacher}`;
              document.querySelector('#quizzInfo').innerHTML = `Quizz : ${data.quizzTitle}`;
              document.querySelector('#groupInfo').innerHTML = `Groupe : ${data.groupName}`;
       }

       updateStudentList(studentName, id, status, numberOfRegisteredStudents) {
              if (status == "not registered anymore") {
                     document.querySelector(`#id${id}`).classList = "list-group-item list-group-item-action list-group-item-warning d-flex justify-content-center align-items-start";
                     return;
              }
              if (!document.getElementById(`id${id}`)) {
                     document.querySelector('#studentListTitle').innerHTML = `Liste des étudiants prêts et enregistrés (${numberOfRegisteredStudents})`;

                     let ul = document.getElementById("studentList");
                     let li = document.createElement("li");
                     li.setAttribute("id", `id${id}`);

                     if (status == "registered") {
                            li.classList = "list-group-item list-group-item-action list-group-item-success d-flex justify-content-center align-items-start";

                     } else if (status == "not registered") {
                            li.classList = "list-group-item list-group-item-action list-group-item-danger d-flex justify-content-center align-items-start";
                     } else {
                            li.classList = "list-group-item list-group-item-action list-group-item-warning d-flex justify-content-center align-items-start";
                     }
                     let div = document.createElement("div");
                     div.classList = "ms-2";
                     div.setAttribute("id", "studentName");
                     div.appendChild(document.createTextNode(studentName));
                     li.appendChild(div);
                     ul.appendChild(li);
              } else {
                     document.querySelector(`#id${id} #studentName`).innerHTML = studentName;
              }
       }
}