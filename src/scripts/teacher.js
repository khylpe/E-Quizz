// Description: This file contains the javascript code for the teacher page

// Initial value of the DOM elements
document.querySelector('#studentListTitle').innerHTML = `Liste des étudiants prêts et enregistrés`;
document.querySelector('#studentList').style.minHeight = document.querySelector('#connectedStudents').offsetHeight + "px";
document.querySelector('#createSession').style.display = "none";
document.querySelector('#sessionStatus').style.display = "none";

document.querySelector('#connectionForm').addEventListener('submit', (e) => {
       e.preventDefault();
       let mail = document.querySelector('#teacherMail').value, password = document.querySelector('#teacherPassword').value;
       socket = io();
       socket.emit('teacher tries to connect', { mail, password });
       socket.on('teacher connected', () => {
              document.querySelector('#connection').style.display = "none";
              document.querySelector('#createSession').style.display = "block";
       });
});

/*socket.emit('teacher tries to connect', { mail})*/


/*(async function fetchQuizzNames() {
       await fetch('getQuizzNames.php', { method: 'get' })
              .then(response => response.json())
              .then((data) => {
                     let quizzList = document.querySelector('#quizzList');

                     data.forEach((quizzName) => {
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

                     document.querySelectorAll('#quizzInList').forEach((nameInList) => {
                            nameInList.addEventListener('click', () => {
                                   document.querySelector('#quizzName').value = nameInList.innerHTML;
                                   document.querySelector('#dropdownButtonStudentGroup').classList.remove('disabled');
                            });
                     });
              })
              .catch((error) => {
                     console.error('Error:', error);
              });
})();*/

// Readonly and required don't work together, so we have to do it manually
document.querySelectorAll('#createSession input[type="text"]').forEach((input) => {
       input.addEventListener('input', (e) => {
              e.target.value = "";
       });
});

document.querySelectorAll('#groupInList').forEach((studentGroupsInList) => {
       studentGroupsInList.addEventListener('click', () => {
              document.querySelector('#quizzGroup').value = studentGroupsInList.innerHTML;
       });
});

document.querySelector('#createSessionForm').addEventListener('submit', (e) => {
       e.preventDefault();
       socket = io();


       let quizzName = document.querySelector('#quizzName').value, studentGroup = document.querySelector('#quizzGroup').value;
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