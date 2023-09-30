<?php
require('connectToDB.php');

if (!isset($_POST['mail']) || !isset($_POST['password']) || empty($_POST['mail']) || empty($_POST['password'])) {
       $_SESSION['tempMessage'] = array(
              'status' => 'warning',
              'value' => "Vous devez renseigner un mail ainsi qu'un mot de passe"
       );
       header('location:../../index.php');
       die();
} else {
       $mail = $_POST['mail'];
       $password = $_POST['password'];

       try {
              $sql = $db->prepare('SELECT * from user WHERE mail = :identifier AND password = :password');
              $sql->execute(array(
                     ':identifier' => $mail,
                     ':password' => $password
              ));
              $resul = $sql->fetch(PDO::FETCH_ASSOC);
       } catch (Exception $e) {
              $_SESSION['tempMessage'] = array(
                     'status' => 'danger',
                     'value' => 'An error occurred : ' . $e->getMessage()
              );
              header('location:../../index.php');
              die();
       }

       if ($resul) {
              $_SESSION['mail'] = $resul['mail'];
              $_SESSION['sessionStatus'] = 'connected';
              $_SESSION['uid'] = $resul['id'];
              header('location:../../navigation.html');
              die();
       } else {
              $_SESSION['tempMessage'] = array(
                     'status' => 'warning',
                     'value' => 'Wrong credentials, try again'
              );
              header('location:../../index.php');
              die();
       }
}
