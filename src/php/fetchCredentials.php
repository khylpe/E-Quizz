<?php
require('connectToDB.php');

$mail = $_POST['mail'];
$password = $_POST['password'];

session_start();

try{
    $sql = $db->prepare('SELECT * from user WHERE mail = :identifier AND password = :password');
    $sql->execute(array(':identifier' => $mail,
                         ':password' => $password));
    $resul = $sql->fetch(PDO::FETCH_ASSOC);
}

catch(Exception $e){
    $_SESSION['errorOccurred'] = $e->getMessage();
    header('location:../../index.php');
    die();
}   

if($resul){
        header('location:../../teacher.php');
        die();
    }
else{
    $_SESSION['errorOccurred'] = "Wrong credentials, try again";
    header('location:../../index.php');
    die();    
}    
?>