<?php
require('connectToDB.php');
$mail = file_get_contents('php://input');

if($_SESSION['sessionStatus'] != "connected" || !isset($_SESSION['mail']) || empty($_SESSION['mail']) || empty($mail) || $mail != $_SESSION['mail']) {
       $response = array('error', 'session error');
       echo json_encode($response);
       die();
}else{
       try {
       $fetchQuizzList = $db->prepare("SELECT DISTINCT title FROM quizz WHERE author = :mail");
       $fetchQuizzList->execute(array(':mail' => $mail));

       $result = $fetchQuizzList->fetchAll(PDO::FETCH_COLUMN, 0);
       $response = array('success', $result);
       echo json_encode($response);
} catch (Exception $e) {
       $response = array('error', $e);
       echo json_encode($response);
}
}

