<?php session_start();
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
       <title>E-Quizz - Enseignant | Consultation des résultats</title>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">

       <link rel="stylesheet" href="src/styles/main.css">
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
                                                        <a href="create.php"><button class="btn border border-info w-100 text-info">Créer QCM</button></a>
                                                 </li>
                                                 <li class="mt-1">
                                                        <a href="session.php"><button class="btn border border-info w-100 text-info">Évaluer</button></a>
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
                                                 <h5 class="text-light">Consultation des résultats</h5>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </nav>
       </div>

       <!-- divider -->
       <hr class="container">

       <div id="tempMessage" role="alert">
       </div>

       <!-- Select quizz or student to see results -->
       <section id="sectionSelectQuizzOrStudent" class="container-fluid d-flex justify-content-center flex-row">
              <div class="col-4 mt-5">
                     <div class="container text-center">
                            <div class="row">
                                   <div class="">
                                          <div class="card text-center">
                                                 <h5 class="card-header">Recherche par quizz
                                                 </h5>
                                                 <div class="card-body">
                                                        <form id="seeResultsForm">
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

                                                               <div class="mb-3 d-flex flex-column">
                                                                      <label class="form-label">Date du quizz</label>
                                                                      <div class="btn-group">
                                                                             <button type="button" class="btn btn-lg btn-secondary dropdown-toggle disabled" data-bs-toggle="dropdown" aria-expanded="false" id="dropdownButtonDates">
                                                                                    <span id="dateSelected">Selectionner une date</span>
                                                                             </button>
                                                                             <ul class="dropdown-menu w-100 text-center text-primary-emphasis bg-primary-subtle border border-primary-subtle" id="datesList">
                                                                             </ul>
                                                                      </div>
                                                               </div>
                                                               <div class="d-flex d-flex justify-content-evenly">
                                                                      <button type="submit" class="btn btn-primary disabled" id="submitSeeResults">Accéder aux résultats du quizz</button>
                                                                      <button class="ms-2 btn btn-primary disabled" id="exportAsCSV"><i class="bi bi-download"></i></button>
                                                               </div>
                                                        </form>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </div>

              <div  class="col-4 mt-5">
                     <div class="row">
                            <div class="">
                                   <div class="card text-center">
                                          <h5 class="card-header">Recherche par élève
                                          </h5>
                                          <div class="card-body">
                                                 <form id="seeResultsByStudentForm">
                                                        <div class="mb-3 d-flex flex-column">
                                                               <label for="studentMail" class="form-label">Adresse mail de l'élève</label>
                                                               <input type="text" class="form-control" id="studentMail" autocomplete="off">
                                                        </div>
                                                 </form>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </div>
       </section>

       <!-- displaying results -->
       <section id="sectionDisplayResults" class="mt-5 mb-5">
              <div id="accordionResult" class="accordion container">
              </div>
       </section>

       <!-- Button to scroll to the top of the page -->
       <div class="container-flex d-flex flex-row-reverse fixed-bottom mb-5 me-5 position-relative">
              <i id="scrollButton" class="hover-pointer bi bi-arrow-up-square-fill z-100 position-relative" style="font-size: 3rem; color: white;"></i>
       </div>

       <div class="container-fluid d-flex flex-row-reverse fixed-bottom">
              <i class="bi bi-heart-fill text-white"></i>
       </div>

       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
       <script type="module" src="src/scripts/results.js"></script>
</body>

</html>