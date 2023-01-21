class ManageFront{
       constructor(){
              document.querySelector('#studentListTitle').innerHTML = `Liste des étudiants prêts et enregistrés`;
              document.querySelector('#studentList').style.minHeight = document.querySelector('#connectedStudents').offsetHeight + "px";
              document.querySelector('#sessionStatus').style.display = "none";
              document.querySelector('#tempMessage').style.display = "none";
       }
       
       tempMessage(type, message) {
              if (type == "error") {
                     type = "alert alert-danger";
              } else if (type == "success") {
                     type = "alert alert-success";
              }
       
              let tempMessage = document.querySelector('#tempMessage');
              tempMessage.innerHTML = message;
              tempMessage.classList = 'text-center container ' + type;
              tempMessage.style.display = "block";
              setTimeout(() => {
                     tempMessage.style.display = "none";
              }, 9000);
       }
       
       displayQuizzList(quizzListTitles) {
              if (quizzListTitles[0] == "error") {
                     this.tempMessage('error', quizzListTitles[1]);
                     return;
              }
       
              let quizzList = document.querySelector('#quizzList');
              quizzList.innerHTML = "";
              quizzListTitles[1].forEach((quizzName) => {
                     console.log()
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
                            document.querySelector('#dropdownButtonStudentGroup').classList.remove('disabled');
                            document.querySelector('#quizzSelected').innerHTML = nameInList.innerHTML;
                     });
              });
       }
       
       displayStudentGroups(groupsListNames) {
              if (groupsListNames[0] == "error") {
                     this.tempMessage('error', groupsListNames[1]);
                     return;
              }       
              let groupsList = document.querySelector('#groupsList');
       
              groupsListNames[1].forEach((groupName) => {
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
       
              document.querySelectorAll('#groupInList').forEach((groupInList) => {
                     groupInList.addEventListener('click', () => {
                            document.querySelector('#groupSelected').innerHTML = groupInList.innerHTML;
                            document.querySelector('#submitCreateSession').classList.remove('disabled');
                     });
              });
       }
}