<?php
require('connectToDB.php');
$entityBody = file_get_contents('php://input');
$data = json_decode($entityBody, true);

if ($_SESSION['sessionStatus'] != "connected" || !isset($_SESSION['mail']) || empty($_SESSION['mail']) || $_SESSION['mail'] != $data['author']) {
       $response = array('error', 'session error');
       echo json_encode($response);
       die();
} else {
       try {
              $fetchQuizzList = $db->prepare("SELECT    question,
                                                        answer1, 
                                                        answer2,
                                                        answer3,
                                                        answer4,
                                                        `good answer1`,
                                                        `good answer2`,
                                                        `good answer3`,
                                                        `good answer4`,
                                                        `question number`
                                                        FROM `quizz` 
                                                        WHERE `title` = :quizzTitle
                                                        AND `author` = :uid");

              $fetchQuizzList->execute(array(
                     ':quizzTitle' => $data['quizzName'],
                     ':uid' => $_SESSION['uid']
              ));

              $result = $fetchQuizzList->fetchAll(PDO::FETCH_ASSOC);
              $arrayOfQuestionsAndAnswers = array();

              foreach ($result as $key => $value) {
                     $i = 0;
                     $j = 0;
                     $tab = array('', array(), array(),);
                     foreach ($value as $key2 => $value2) {
                            if ($key2 == "question") {
                                   $tab[0] = $value2;
                            }
                            if ($key2 == "answer1" || $key2 == "answer2" || $key2 == "answer3" || $key2 == "answer4") {
                                   $tab[1][$i++] = $value2;
                            }
                            if ($key2 == "good answer1" || $key2 == "good answer2" || $key2 == "good answer3" || $key2 == "good answer4") {
                                          $tab[2][$j++] = $value2;
                            }
                            if($key2 == "question number"){
                                   $tab[3] = $value2;
                            }
                     }
                     array_push($arrayOfQuestionsAndAnswers, $tab);
              }
              $response = array('success', $arrayOfQuestionsAndAnswers);
              echo json_encode($response);
       } catch (Exception $e) {
              $response = array('error', $e);
              echo json_encode($response);
       }
}
