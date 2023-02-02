<?php
session_start();

if (!isset($_SESSION['sessionStatus']) || $_SESSION['sessionStatus'] != 'connected' || !isset($_SESSION['mail'])) {
       header('location:../../index.php');
       die();
}
?>
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">

<head>
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>E-Quizz - Enseignant</title>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
       <link rel="stylesheet" href="src/styles/teacher.css">
</head>

<body>
       <div class="container">
              <nav class="navbar navbar-expand">
                     <div class="collapse navbar-collapse d-flex">
                            <div class="d-flex col-3 justify-content-start">
                                   <div class="btn-group">
                                          <button class="btn btn-outline-light"><i class="bi bi-person"></i></button>
                                          <button type="button" class="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                          </button>

                                          <ul class="user dropdown-menu dropdown-menu-start">
                                                 <li class="dropdown-item disabled" id="mail"><?php echo $_SESSION['mail']; ?></li>
                                                 <li>
                                                        <hr class="dropdown-divider">
                                                 </li>
                                                 <li>
                                                        <a href="createQuizz.php"><button class="btn border border-info w-100 text-info">Créer un QCM</button></a>
                                                 </li>
                                                 <li class="mt-1" id="logout"><a href="src/php/logout.php"><button class="btn btn-outline-danger w-100"><i class="bi bi-box-arrow-right"></i></button></a></li>
                                          </ul>
                                   </div>
                            </div> 
                            <h1 class="navbar-nav col-6 justify-content-center">
                                   E-Quizz
                            </h1>
                     </div>
              </nav>
       </div>
       <hr class="container">

       <div id="tempMessage" role="alert">
       </div>
       <div class="accordion-item container text-center mt-5" id="sessionInfo">
              <div class="col-lg-6 offset-lg-3">
                     <div class="card accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                   <h5 class="card-header w-100 text-center">
                                          Informations de la session </h5>
                            </button>
                            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                   <div class="accordion-body">
                                          <ui class="list-group">
                                                 <li class="list-group-item list-group-item-info" id="sessionStatusInfo"></li>
                                                 <li class="list-group-item list-group-item-info" id="teacherInfo"></li>
                                                 <li class="list-group-item list-group-item-info" id="quizzInfo"></li>
                                                 <li class="list-group-item list-group-item-info" id="groupInfo"></li>
                                          </ui>
                                   </div>
                            </div>
                     </div>
              </div>
       </div>

       <section id="sectionCreateSession">
              <div class="container text-center mt-5" id="createSession">
                     <div class="row">
                            <div class="col-lg-6 offset-lg-3">
                                   <div class="card text-center">
                                          <h5 class="card-header">Créer une session
                                          </h5>
                                          <div class="card-body">
                                                 <form id="createSessionForm">
                                                        <div class="mb-3 d-flex flex-column">
                                                               <label for="quizzName" class="form-label">Nom
                                                                      du
                                                                      quizz</label>
                                                               <div class="btn-group">
                                                                      <button id="buttonDisplayQuizzList" type="button" class="btn btn-lg btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">

                                                                             <span id="quizzSelected">Selectionner un quizz</span>
                                                                      </button>
                                                                      <ul class="dropdown-menu w-100 text-center text-primary-emphasis bg-primary-subtle border border-primary-subtle" id="quizzList">
                                                                      </ul>
                                                               </div>
                                                        </div>
                                                        <div class="mb-3 d-flex flex-column">
                                                               <label for="studentGroup" class="form-label">Groupe
                                                                      d'étudiants</label>
                                                               <div class="btn-group">
                                                                      <button type="button" class="btn btn-lg btn-secondary dropdown-toggle disabled" data-bs-toggle="dropdown" aria-expanded="false" id="dropdownButtonStudentGroup">
                                                                             <span id="groupSelected">Selectionner un groupe</span>
                                                                      </button>
                                                                      <ul class="dropdown-menu w-100 text-center text-primary-emphasis bg-primary-subtle border border-primary-subtle" id="groupsList">
                                                                      </ul>
                                                               </div>
                                                        </div>
                                                        <button type="submit" class="btn btn-primary disabled" id="submitCreateSession">Créer la session</button>
                                                 </form>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </div>
       </section>
       <section id="sectionSessionStatus">
              <div class="container mt-5" id="sessionStatus">
                     <div class="row">
                            <div class="col-6">
                                   <div class="card text-center">
                                          <h5 class="card-header">Nombre d'étudiants
                                                 connectés</h5>
                                          <p class="card-body display-1" id="numberOfConnectedStudents">0</p>
                                   </div>
                            </div>
                            <div class="col-6">
                                   <div class="card text-center">
                                          <h5 class="card-header" id="studentListTitle"></h5>
                                          <ul class="text-center list-group" id="studentList">
                                                 <li class="list-group-item list-group-item-action list-group-item-success d-flex justify-content-center align-items-start">
                                                        <div class="ms-2">Arthur
                                                        </div>
                                                        <span class="badge bg-primary rounded-pill position-absolute">14</span>
                                                 </li>
                                          </ul>
                                   </div>
                            </div>
                     </div>
                     <div class="text-center mt-5">
                            <button type="submit" class="btn btn-primary" id="startSession">Commencer
                                   la session</button>
                     </div>
              </div>
       </section>

       <section id="sectionDisplayQuestions">
              <div class="container col-8 mt-5" id="displayQuestions">
                     <div class="card text-center list-group">
                            <h5 class="card-header list-group-item list-group-item-primary border border-primary-subtle" id="question">Quelle est la capitale de la France ?</h5>
                            <div class="card-body" id="possibleAnswers">
                            </div>

                     </div>

                     <div class="text-center mt-5">
                            <button type="submit" class="btn btn-primary" id="nextQuestion">Question
                                   suivante</button>
                     </div>

       </section>

       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
       <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
       <script src="src/scripts/classes/FetchDataFromDB.js"></script>
       <script src="src/scripts/classes/teacher.js"></script>
       <script src="src/scripts/teacher.js"></script>
</body>

</html>
