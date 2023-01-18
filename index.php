<?php
       session_start();
?>
<html lang="en" data-bs-theme="dark">
<head>
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Document</title>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">

</head>
<body>
       <div class="container-fluid">
              <h1 class="text-center">E-Quizz</h1>
       </div>
       <hr class="container">
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
                                                        <input class="form-control" type="email" id="teacherMail" name="mail"
                                                               required autocomplete="off">

                                                        <label for="teacherPassword" class="form-label">Mot de
                                                               passe</label>
                                                        <input class="form-control" type="password" id="teacherPassword" name="password"
                                                               required autocomplete="off">
                                                 </div>
                                                 <button type="submit" class="btn btn-primary mt-3">Se
                                                        connecter</button>
                                          </form>
                                   </div>
                            </div>
                     </div>
              </div>
       </div>
       </div>
       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
       <script src="src/scripts/index.js"></script>

</body>
</html>