<?php

require('connectToDB.php');
try {
       $fetchQuizzList = $db->prepare("SELECT DISTINCT MAX(`quizz number`) FROM quizz;");

       $fetchQuizzList->execute();

       $result = $fetchQuizzList->fetch(PDO::FETCH_ASSOC);
       echo $result['MAX(`quizz number`)']+1;
       
} catch (Exception $e) {
       $response = array('error', $e);
       echo json_encode($response);
}
