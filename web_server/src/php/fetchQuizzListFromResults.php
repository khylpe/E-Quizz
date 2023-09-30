<?php
require('connectToDB.php');

if ($_SESSION['sessionStatus'] != "connected" || !isset($_SESSION['mail']) || empty($_SESSION['mail'])) {
       $response = array('error', 'session error');
       echo json_encode($response);
       die();
} else {
       try {
              $fetchQuizzList = $db->prepare("SELECT DISTINCT `quizz title` FROM `results` where `teacher` = :uid");
              $fetchQuizzList->execute(array(
                     ':uid' => $_SESSION['uid']
              ));

              $fetchQuizzList->execute();

              $result = $fetchQuizzList->fetchAll(PDO::FETCH_COLUMN, 0);
              $response = array('success', $result);
              echo json_encode($response);
       } catch (Exception $e) {
              $response = array('error', $e);
              echo json_encode($response);
       }
}
