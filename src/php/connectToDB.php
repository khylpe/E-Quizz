<?php
$serveur = 'localhost';
$base = 'equizz';
$login_DB = 'root';
$password_DB = '';
try {
       $db = new PDO("mysql:host=" . $serveur . ";dbname=" . $base, $login_DB, $password_DB);
} catch (Exception $e) {
       echo "Connexion échouée : " . $e->getMessage();
       die();
}
