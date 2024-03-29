<?php session_start();
if (!isset($_SESSION['sessionStatus']) || $_SESSION['sessionStatus'] != 'connected' || !isset($_SESSION['mail'])) {
       header('location:index.php');
       die();
}
?>
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">

<head>
       <!-- meta -->
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">

       <title>E-Quizz - Enseignant | Création de QCM</title>

       <!-- CDN links -->
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">

       <!-- Styles links -->
       <link rel="stylesheet" href="src/styles/main.css">
       <link rel="stylesheet" href="src/styles/createQuizz.css">
</head>

<body>

       <!-- Header with page title, navigation, logout and save status -->
       <header class="container">
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
                                                        <a href="session.php"><button class="btn border border-info w-100 text-info">Évaluer</button></a>
                                                 </li>
                                                 <li class="mt-1">
                                                        <a href="results.php"><button class="btn border border-info w-100 text-info">Résultats</button></a>
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
                                                 <h5 class="text-light">Création d'un QCM</h5>
                                          </div>
                                   </div>
                            </div>

                            <div class="d-flex col-3 justify-content-end">
                                   <i id="saveStatus" class="bi bi-cloud-arrow-up" style="font-size: 4rem;"></i>
                            </div>
                     </div>
              </nav>
       </header>

       <!-- devider -->
       <hr class="container">

       <div id="tempMessage" role="alert">
       </div>

       <!-- Main section with the form to create a new quizz -->
       <section class="container text-center col-6 text-center offset-3 mt-3" id="createQuizz">
              <div class="input-group input-group-lg">
                     <span class="input-group-text" id="inputGroup-sizing-lg">Titre du QCM</span>
                     <input type="text" class="form-control" id="quizzTitle" autocomplete="off">
              </div>
              <div class="accordion mt-5" id="dataCreateQuizz">
              </div>
              <div class="d-flex flex-row justify-content-evenly align-items-center">
                     <button class="btn btn-info z-100" id="addQuestion"><i class="bi bi-plus-circle-dotted"><span class="ms-3">Ajouter une question au QCM</span></i></button>
                     <button id="confirmQuizzButton" class="z-100 btn btn-success mt-5 mb-5">Enregistrer le QCM</button>
              </div>

              <div class="d-flex justify-content-center">
                     <button id="leaveQuizzCreation" class="z-100 btn btn-warning mt-5 mb-5">Quitter</button>
              </div>
       </section>

       <!-- Button to scroll to the top of the page -->
       <div class="z-1 container-flex d-flex flex-row-reverse fixed-bottom mb-5 me-5">
              <i id="scrollButton" class="hover-pointer bi bi-arrow-up-square-fill" style="font-size: 3rem; color: white;"></i>
       </div>

       <div class="z-1 container-fluid d-flex flex-row-reverse fixed-bottom">
              <i class="bi bi-heart-fill text-white"></i>
       </div>

       <!-- Scripts links -->
       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
       <script type="module" src="src/scripts/create.js"></script>
</body>

</html>