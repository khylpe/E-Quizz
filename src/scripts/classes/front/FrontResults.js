import FrontGlobal from "./FrontGlobal.js";

export default class FrontResults extends FrontGlobal {
       
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

       displayStudentResults(){
              // display student results
       }


}