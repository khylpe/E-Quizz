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
              $fetchQuizzList = $db->prepare("   SELECT    *
                                                 FROM `results` 
                                                 WHERE `quizz title` = :quizzTitle
                                                 AND `teacher` = :uid
                                                 AND `student group` = :studentGroup
                                                 AND `date` = :dates
                                                 GROUP BY `question number`");

                                                 //https://stackoverflow.com/questions/41887460/select-list-is-not-in-group-by-clause-and-contains-nonaggregated-column-inc

              $fetchQuizzList->execute(array(
                     ':quizzTitle' => $data['quizzName'],
                     ':uid' => $_SESSION['uid'],
                     ':studentGroup' => $data['studentGroup'],
                     ':dates' => $data['date']
              ));

              $result = $fetchQuizzList->fetchAll(PDO::FETCH_ASSOC);
              $arrayOfStudentsAnswers = array();
              
              $questionNumber = 0;

              foreach ($result as $key => $value) {
                     $studentMail = "";
                     $answerSubmitted = array();
                     $studentResult = 0;
                     foreach ($value as $key2 => $value2) {
                            if ($key2 == "question number") {
                                   if(!isset($arrayOfStudentsAnswers[$value2-1]) || empty($arrayOfStudentsAnswers[$value2-1] ||$arrayOfStudentsAnswers[$value2-1] == null || $arrayOfStudentsAnswers[$value2-1] == "")){
                                          $questionNumber = $value2;
                                          $arrayOfStudentsAnswers[$value2-1] = array();
                                   }
                            }
                            if ($key2 == "student mail") {
                                   $studentMail = $value2;
                            }
                            if ($key2 == "answer submitted 1" || $key2 == "answer submitted 2" || $key2 == "answer submitted 3" || $key2 == "answer submitted 4") {
                                   array_push($answerSubmitted, $value2);
                            }
                            if ($key2 == "question result") {
                                   $studentResult = $value2;
                            }                            
                     }
                     $tab = array(
                            'studentMail' => $studentMail,
                            'answerSubmitted' => $answerSubmitted,
                            'result' => $studentResult,
                            'questionNumber' => $questionNumber,
                     );                     
                     array_push($arrayOfStudentsAnswers[$questionNumber-1], $tab);
              }
              $response = array('success', $arrayOfStudentsAnswers);
              echo json_encode($response);
       } catch (Exception $e) {
              $response = array('error', $e);
              echo json_encode($response);
       }
}
