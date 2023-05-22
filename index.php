<?php
session_start();
if (isset($_SESSION['sessionStatus']) && $_SESSION['sessionStatus'] == 'connected' && isset($_SESSION['mail'])) {
       header('location:session.php');
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
       <div class="container-fluid">
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
                            <h5 class="text-light">Connexion</h5>
                     </div>
              </div>
       </div>
       <hr class="container">

       <?php if (isset($_SESSION['tempMessage'])) { ?>
              <div class="alert alert-<?php echo $_SESSION['tempMessage']['status']; ?> text-center container" role="alert">
                     <?php echo $_SESSION['tempMessage']['value']; ?>
              </div>
       <?php unset($_SESSION['tempMessage']);
       } ?>
       <div class="container" id="connection">
              <div class="row">
                     <div class="col-6 offset-3">
                            <div class="card text-center">
                                   <h5 class="card-header">Connexion</h5>
                                   <div class="card-body">
                                          <form method="POST" action="src/php/fetchCredentials.php" id="connectionForm">
                                                 <div class="mb-3 d-flex flex-column">
                                                        <label for="teacherMail" class="form-label">Mail de
                                                               l'enseignant</label>
                                                        <input class="form-control" type="email" id="teacherMail" name="mail" required autocomplete="off">

                                                        <label for="teacherPassword" class="form-label">Mot de
                                                               passe</label>
                                                        <input class="form-control" type="password" id="teacherPassword" name="password" required autocomplete="off">
                                                 </div>
                                                 <button type="submit" class="btn btn-primary mt-3">Se
                                                        connecter</button>
                                          </form>
                                   </div>
                            </div>
                     </div>
              </div>
       </div>

       <div class="container-fluid d-flex flex-row-reverse fixed-bottom">
              <i class="bi bi-heart-fill text-white"></i>
       </div>

       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
</body>

</html>