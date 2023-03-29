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
       <title>EQuizz - Création de QCM</title>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
       <link rel="stylesheet" href="src/styles/createQuizz.css">
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
                                                        <a href="results.php"><button class="btn border border-info w-100 text-info">Résultats des Quizz</button></a>
                                                 </li>
                                                 <li class="mt-1" id="logout"><a href="src/php/logout.php"><button class="btn btn-outline-danger w-100"><i class="bi bi-box-arrow-right"></i></button></a></li>
                                          </ul>
                                   </div>

                            </div>
                            <div class="navbar-nav col-6 justify-content-center">
                                   <div class="d-flex flex-column text-center">
                                         <h1>
                                                 <span class="text-info">E</span>
                                                 <span class="">-</span>
                                                 <span class="text-warning">Q</span>
                                                 <span class="text-danger">U</span>
                                                 <span class="text-success">I</span>
                                                 <span class="text-primary">Z</span>
                                                 <span class="text-info">Z</span>
                                          </h1>                                          
                                          <div>
                                                 <h5 class="text-light">Création d'un QCM</h5>
                                          </div>
                                   </div>                                   
                            </div>
                     </div>
              </nav>
       </div>
       <hr class="container">

       <div id="tempMessage" role="alert">
       </div>

       <section class="container text-center" id="creatingQuizz">
              <div class="col-6 text-center offset-3">
                     <div id="title" class="mt-5">
                            <form id="quizzTitleForm">
                                   <div class="col">
                                          <label for="quizzTitle">Titre du QCM</label>
                                          <input type="text" class="form-control mt-3" id="quizzTitle" placeholder="" autocapitalize="sentences" required autocomplete="off">
                                   </div>

                                   <button id="confirmTitle" type="submit" class="mt-5 btn btn-primary">Confirmer le titre</button>
                            </form>
                     </div>

                     <div id="questionAndAnswers">
                            <form id="confirmQuestionAndAnswersForm">
                                   <div id="question">
                                          <div class="col">
                                                 <label for="questionValue" id="questionNumber">Question n°1 :</label>
                                                 <input type="text" class="form-control" id="questionValue" required autocomplete="off" autocapitalize="sentences">
                                          </div>
                                   </div>

                                   <div id="answers" class="mt-5 d-flex flex-column">
                                          <label for="answer1">Réponse 1 : </label>
                                          <div class="d-flex flex-row align-items-center">
                                                 <input class="form-check-input me-3" type="checkbox" value="" id="flexCheckDefault">
                                                 <input class="form-control" type="text" name="" id="answer1" required autocomplete="off" autocapitalize="sentences">
                                          </div>
                                          <label for="answer2" class="mt-4">Réponse 2 : </label>

                                          <div class="d-flex flex-row align-items-center">
                                                 <input class="form-check-input me-3" type="checkbox" value="" id="flexCheckDefault">
                                                 <input type="text" name="" class="form-control" id="answer2" required autocomplete="off" autocapitalize="on">
                                          </div>

                                          <label for="answer3" class="mt-4">Réponse 3 : </label>
                                          <div class="d-flex flex-row align-items-center">
                                                 <input class="form-check-input me-3" type="checkbox" value="" id="flexCheckDefault">
                                                 <input type="text" name="" class="form-control" id="answer3" autocomplete="off" autocapitalize="sentences">
                                          </div>

                                          <label for="answer4" class="mt-4">Réponse 4 : </label>
                                          <div class="d-flex flex-row align-items-center">
                                                 <input class="form-check-input me-3" type="checkbox" value="" id="flexCheckDefault">
                                                 <input type="text" name="" class="form-control" id="answer4" autocomplete="off" autocapitalize="sentences">
                                          </div>
                                   </div>
                                   <div class="d-flex flex-column mb-5">
                                          <button id="confirmQuestionAndAnswers" type="submit" class=" btn btn-primary mt-5">Confirmer cette question et ses réponses</button>
                                   </div>
                            </form>
                     </div>

                     <button id="checkQuizz" class="btn btn-success mt-2">Vérifier</button>

              </div>
       </section>

       <section class="container text-center" id="confirmQuizz">
              <div class="col-6 text-center offset-3" id="dataConfirmQuizz">
              </div>
              <div class="col-6 text-center offset-3">
                     <button id="confirmQuizzButton" class="btn btn-success mt-5">Confirmer</button>
              </div>
       </section>

       <section class="container text-center" id="quizzCreated">
              <div class="col-6 text-center offset-3">
                     <h1 class="mt-5">Votre QCM a bien été créé !</h1>
                     <a href="session.php"><button class="btn btn-primary mt-5">Démarer une session</button></a>
              </div>
       </section>

       <div class="container-fluid d-flex flex-row-reverse fixed-bottom">
              <i class="bi bi-heart-fill text-white"></i>
       </div>

       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
       <script type="module" src="src/scripts/create.js"></script>
</body>

</html>