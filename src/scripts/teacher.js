/* Description: This file contains the javascript code for the teacher page */

mail = document.querySelector('#mail').innerText;
let socket = io('http://localhost:8100/');

socket.on('connect', () => {
       socket.emit('teacher', mail);
});
let fetchData = new FetchDataFromDB(mail);
let manageFront = new ManageFront();

/*     fetch the list of quizz and display it by 
       passing the returned value of 'fetchQuizzList' method from FetchDataFromDB class
       to 'displayQuizzList' method from manageFront class */

fetchData.fetchQuizzList()
       .then(value => manageFront.displayQuizzList(value));

/*     fetch the list of groups and display it by 
       passing the returned value of 'fetchStudentGroups' method from FetchDataFromDB class
        to 'displayStudentGroups' method from manageFront class */

fetchData.fetchStudentGroups()
       .then(value => manageFront.displayStudentGroups(value));

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