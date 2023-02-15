<?php
require('connectToDB.php');
$entityBody = file_get_contents('php://input');
$data = json_decode($entityBody, true);
if ($_SESSION['sessionStatus'] != "connected" || !isset($_SESSION['mail']) || empty($_SESSION['mail'])) {
       $response = array('error', 'session error');
       echo json_encode($response);
       die();
} else {
       try {
              $fetchQuizzList = $db->prepare("SELECT DISTINCT `student group`
              FROM `results`
              WHERE `teacher` = :uid
              AND `quizz title` = :quizzTitle");

              $fetchQuizzList->execute(array(
                     ':uid' => $_SESSION['uid'],
                     ':quizzTitle' => $data['quizzName']
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
