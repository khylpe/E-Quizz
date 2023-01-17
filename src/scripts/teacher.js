// Description: This file contains the javascript code for the teacher page

// Initial value of the DOM elements
document.querySelector('#studentListTitle').innerHTML = `Liste des étudiants prêts et enregistrés`;
document.querySelector('#studentList').style.minHeight = document.querySelector('#connectedStudents').offsetHeight + "px";
document.querySelector('#createSession').style.display = "none";
document.querySelector('#sessionStatus').style.display = "none";

const socket = io('localhost:8100');

socket.on('teacher already connected', (mail) => {
       document.querySelector('#teacherMail').value = mail;
       document.querySelector('#teacherMail').innerHTML = mail;
});
document.querySelector('#connectionForm').addEventListener('submit', (e) => {
       e.preventDefault();

       /* Get the values from the form */
       let mailFromForm = document.querySelector('#teacherMail').value,
              passwordFromForm = document.querySelector('#teacherPassword').value;

       /* Connect to the server and try to connect the teacher with the given credentials */
       socket.emit('teacher tries to connect', {
              mail: mailFromForm,
              password: passwordFromForm
       });

       socket.on('teacher connection success', (data) => {
              if (data.sessionStatus == "session started") {
                     document.querySelector('#connection').style.display = "none";
              }
              else if (data.sessionStatus == "session created but not started") {
                     document.querySelector('#connection').style.display = "none";
                     document.querySelector('#sessionStatus').style.display = "block";
              }
              else { // no session created
                     document.querySelector('#connection').style.display = "none";
                     document.querySelector('#createSession').style.display = "block";

                     socket.emit('fetch quizz', data.mail);
                     socket.on('result quizz list', (quizzListTitles) => {
                            displayQuizzList(quizzListTitles);
                            socket.emit('fetch student groups');

                            socket.on('result student groups', (studentGroups) => {
                                   displayStudentGroups(studentGroups);

                                   let createSessionForm = document.querySelector('#createSessionForm');
                                   createSessionForm.addEventListener('submit', (e) => {
                                          e.preventDefault();
                                          let quizzName = document.querySelector('#quizzSelected').value,
                                                 studentGroup = document.querySelector('#groupSelected').value;

                                          socket.emit('create session', { name: quizzName, group: studentGroup });
                                          document.querySelector('#createSession').style.display = "none";
                                          document.querySelector('#sessionStatus').style.display = "block";

                                          socket.on('student connected changed', (numberOfStudentConnected) => {

                                          });
                                   });
                            });
                     })
              }

       });

       socket.on('teacher connection failed', () => {
       });

       document.querySelector('#createSessionForm').addEventListener('submit', (e) => {
              e.preventDefault();

              let quizzName = document.querySelector('#quizzName').value,
                     studentGroup = document.querySelector('#quizzGroup').value;

              socket.emit('create session', { name: quizzName, group: studentGroup });

              document.querySelector('#createSession').style.display = "none";
              document.querySelector('#sessionStatus').style.display = "block";

              // Whenever a student connects or disconnects, update the number of connected students
              // It doesn't mean that the student is registered
              socket.on('student connected changed', (numberOfStudentConnected) => {
                     document.getElementById("connectedStudents").innerHTML = numberOfStudentConnected;
              });

              // Whenever a student registers or disconnects, update the number of registered students
              // Student must be connected to register
              socket.on('students registered changed', (data) => {
                     updateStudentList(data.studentName, data.id, data.status, data.numberOfRegisteredStudents);
              });
       });

});

function displayQuizzList(quizzListTitles) {

       let quizzList = document.querySelector('#quizzList');

       quizzListTitles.forEach((quizzName) => {
              let li = document.createElement('li');
              quizzList.appendChild(li);
              let span = document.createElement('span');
              span.classList = "dropdown-item";
              span.id = "quizzInList";
              span.innerHTML = quizzName.title;
              li.appendChild(span);
              let hr = document.createElement('hr');
              hr.classList = "dropdown-divider quizzNameDivider";
              quizzList.appendChild(hr);
       });

       // Remove the last divider // https://stackoverflow.com/a/5684878/19601188
       var nodes = quizzList.querySelectorAll('.quizzNameDivider');
       var last = nodes[nodes.length - 1];
       quizzList.removeChild(last);

       document.querySelectorAll('#quizzInList').forEach((nameInList) => {
              nameInList.addEventListener('click', () => {
                     document.querySelector('#dropdownButtonStudentGroup').classList.remove('disabled');
                     document.querySelector('#quizzSelected').innerHTML = nameInList.innerHTML;
              });
       });
}

function displayStudentGroups(groupsListNames) {

       let groupsList = document.querySelector('#groupsList');

       groupsListNames.forEach((groupName) => {
              let li = document.createElement('li');
              groupsList.appendChild(li);
              let span = document.createElement('span');
              span.classList = "dropdown-item";
              span.id = "groupInList";
              span.innerHTML = groupName.name;
              li.appendChild(span);
              let hr = document.createElement('hr');
              hr.classList = "dropdown-divider groupsNameDivider";
              groupsList.appendChild(hr);
       });

       // Remove the last divider // https://stackoverflow.com/a/5684878/19601188
       var nodes = groupsList.querySelectorAll('.groupsNameDivider');
       var last = nodes[nodes.length - 1];
       groupsList.removeChild(last);

       document.querySelectorAll('#groupInList').forEach((groupInList) => {
              groupInList.addEventListener('click', () => {
                     document.querySelector('#groupSelected').innerHTML = groupInList.innerHTML;
                     document.querySelector('#submitCreateSession').classList.remove('disabled');
              });
       });
}

function updateStudentList(studentName, id, status, numberOfRegisteredStudents) {
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