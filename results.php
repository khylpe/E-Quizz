<?php session_start();
if (!isset($_SESSION['sessionStatus']) || $_SESSION['sessionStatus'] != 'connected' || !isset($_SESSION['mail'])) {
       header('location:index.php');
       die();
}
?>
<html lang="en" data-bs-theme="dark">

<head>
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Document</title>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">

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
                                                        <a href="session.php"><button class="btn border border-info w-100 text-info">Démarrer une session</button></a>
                                                 </li>
                                                 <li>
                                                        <a href="create.php"><button class="btn border border-info w-100 text-info">Créer un QCM</button></a>
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

       <div class="container-fluid d-flex justify-content-center flex-row">
              <section id="sectionSelectQuizz" class="col-4 mt-5">
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
                                                               <button type="submit" class="btn btn-primary disabled" id="submitSeeResults">Accéder aux résultats du quizz</button>
                                                        </form>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </section>

              <section id="searchEngine" class="col-4 mt-5">
              <div class="row">
                                   <div class="">
                                          <div class="card text-center">
                                                 <h5 class="card-header">Recherche par élève
                                                 </h5>
                                                 <div class="card-body">
                                                        <form id="seeResultsForm">
                                                               <div class="mb-3 d-flex flex-column">
                                                                      <label for="studentMail" class="form-label">Adresse mail de l'élève</label>
                                                                      <input type="text" class="form-control" id="studentMail" autocomplete="off">

                                                               </div>                                                        
                                                        </form>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
              </section>
       </div>

       <section id="sectionDisplayResults" class="mt-5 mb-5">
              <div id="accordionResult" class="accordion container">
              </div>
       </section>

       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
       <script type="module" src="src/scripts/results.js"></script>
</body>

</html>