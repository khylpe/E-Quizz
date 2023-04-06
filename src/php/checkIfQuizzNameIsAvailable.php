<?php

require('connectToDB.php');
$data = file_get_contents('php://input');
$toJSON = json_decode($data, true);
$title = $toJSON['quizzName'];

try {
       $fetchQuizzList = $db->prepare("SELECT distinct title FROM quizz WHERE title = :title AND author = :uid");
       $fetchQuizzList->execute(array(
              ':uid' => $_SESSION['uid'],
              ':title' => $title
       ));

       $fetchQuizzList->execute();

       $result = $fetchQuizzList->fetch(PDO::FETCH_ASSOC);
       if($result){
              $response = array('error', 'quizz name already taken');
              echo json_encode($response);
       } else {
              $response = array('success', 'quizz name is free');
              echo json_encode($response);
       }
} catch (Exception $e) {
       $response = array('error', $e);
       echo json_encode($response);
}
