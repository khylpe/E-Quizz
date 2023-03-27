<?php
require('connectToDB.php');
$entityBody = file_get_contents('php://input');
$data = json_decode($entityBody, true);

if ($_SESSION['sessionStatus'] != "connected" || !isset($_SESSION['mail']) || empty($_SESSION['mail']) || $_SESSION['mail'] != $data['teacherMail']) {
       $response = array('error', 'session error');
       echo json_encode($response);
       die();
} else {
       try {
              $fetchQuizzList = $db->prepare("
                                                 SELECT *
                                                 FROM `results` 
                                                 WHERE `quizz title` = :quizzTitle
                                                 AND `teacher` = :uid
                                                 AND `student group` = :studentGroup
                                                 AND `date` = :dates
                                                 ORDER BY `question number`, `student mail`
                                          ");

              $fetchQuizzList->execute(array(
                     ':quizzTitle' => $data['quizzName'],
                     ':uid' => $_SESSION['uid'],
                     ':studentGroup' => $data['studentGroup'],
                     ':dates' => $data['date']
              ));

              $fetchResult = $fetchQuizzList->fetchAll(PDO::FETCH_ASSOC);
              $results = array();

              foreach ($fetchResult as $value) {
                     $questionNumber = $value['question number'];

                     $results[$questionNumber][$value['student mail']] = array(
                            'studentMail' => $value['student mail'],
                            'answerSubmitted' => array(
                                   $value['answer submitted 1'],
                                   $value['answer submitted 2'],
                                   $value['answer submitted 3'],
                                   $value['answer submitted 4']
                            ),
                            'result' => $value['question result'],
                            'questionNumber' => $value['question number']
                     );
              }

              // Reformat the results array
              $output = array();
              foreach ($results as $questionNumber => $students) {
                     $output[$questionNumber] = array_values($students);
              }

              echo json_encode(array('success', $output));
       } catch (Exception $e) {
              $response = array('error', $e);
              echo json_encode($response);
       }
}
