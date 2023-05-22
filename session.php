<?php
session_start();

if (!isset($_SESSION['sessionStatus']) || $_SESSION['sessionStatus'] != 'connected' || !isset($_SESSION['mail'])) {
       header('location:index.php');
       die();
}
?>
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">

<head>
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>E-Quizz - Enseignant | Session d'évalutaion</title>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
       <link rel="stylesheet" href="src/styles/session.css">
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

                                          <ul class="pb-0 user dropdown-menu dropdown-menu-start">
                                                 <li class="dropdown-item disabled" id="mail"><?php echo $_SESSION['mail']; ?></li>
                                                 <li>
                                                        <hr class="dropdown-divider">
                                                 </li>
                                                 <li>
                                                        <a href="create.php"><button class="btn border border-info w-100 text-info">Créer un QCM</button></a>
                                                 </li>
                                                 <li class="mt-1">
                                                        <a href="results.php"><button class="btn border border-info w-100 text-info">Résultats des QCM</button></a>
                                                 </li>
                                                 
                                                 <li class="mt-1">
                                                        <a href="navigation.html"><button class="btn border border-light w-100 text-white">Page de navigation</button></a>
                                                 </li>

                                                 <li class="mt-1" id="logout"><a href="src/php/logout.php"><button class="btn btn-outline-danger w-100"><i class="bi bi-box-arrow-right"></i></button></a></li>
                                          </ul>
                                   </div>
                            </div>
                            <div class="navbar-nav col-6 justify-content-center">
                                   <div class="d-flex flex-column text-center">
                                          <a href="navigation.html" class="text-decoration-none">
                                                 <h1>
                                                        <span class="text-info">E</span>
                                                        <span class="">-</span>
                                                        <span class="text-warning">Q</span>
                                                        <span class="text-danger">U</span>
                                                        <span class="text-success">I</span>
                                                        <span class="text-primary">Z</span>
                                                        <span class="text-info">Z</span>
                                                 </h1>
                                          </a>
                                          <div>
                                                 <h5 class="text-light">Session d'évalutation</h5>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </nav>
       </div>
       <hr class="container">

       <div id="tempMessage" role="alert">
       </div>
       <div class="d-flex flex-row justify-content-evenly" id="infosAndNumberAnswers">
              <div class="accordion-item text-center mt-5" id="sessionInfo">
                     <div class="">
                            <div class="card accordion-header" id="headingOne">
                                   <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                          <h5 class="card-header w-100 text-center">
                                                 Informations de la session</h5>
                                   </button>
                                   <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                          <div class="accordion-body" id="bodySessionInformations">
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
              <div class="accordion-item text-center mt-5" id="numberOfAnswer">
                     <div class="">
                            <div class="card accordion-header" id="headingTwo">
                                   <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                          <h5 class="card-header w-100 text-center">
                                                 Nombre de réponses soumises</h5>
                                   </button>
                                   <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                          <div class="accordion-body" id="bodyNumberOfAnswerSent">
                                                 <p class="card-body display-1" id="numberOfAnswerSent">0</p>
                                          </div>
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
                                          <h5 class="card-header" id="studentListTitle">Liste des étudiants enregistrés</h5>
                                          <ul class="text-center list-group" id="studentList">
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
                            <span class="card-header list-group-item list-group-item-primary border text-info fs-1" id="question"></span>
                            <div class="card-body d-flex justify-content-center" id="possibleAnswers">
                            </div>
                     </div>

                     <div class="text-center mt-5">
                            <button type="submit" class="btn btn-primary mb-5" id="nextQuestion">Question suivante</button>
                            <button type="submit" class="btn btn-success" id="seeResult">Accéder aux résultats</button>
                     </div>

       </section>

       <section id="sectionDisplayResults">
              <div class="container col-8 mt-5">
                     <div class="accordion" id="accordionForResults">
                     </div>
                     <div class="text-center mt-5">
                            <button type="submit" class="btn btn-warning" id="leaveSession">Quitter la session</button>
                     </div>
              </div>
       </section>
       <div class="container-fluid d-flex flex-row-reverse fixed-bottom">
              <i class="bi bi-heart-fill text-white"></i>
       </div>

       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
       <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
       <script type="module" src="src/scripts/session.js"></script>
</body>

</html>