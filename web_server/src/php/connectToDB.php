<?php
session_start();
$serveur = 'localhost';
$base = 'equizz';
$login_DB = 'root';
$password_DB = '';

try {
       $db = new PDO("mysql:host=" . $serveur . ";dbname=" . $base, $login_DB, $password_DB);
}
catch (Exception $e) {
       $_SESSION['tempMessage'] = array(  'status' => 'danger',
                                          'value' => 'An error occurred : ' . $e->getMessage());
       header('location:../../index.php');
       die();
}