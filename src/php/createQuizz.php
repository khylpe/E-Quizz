<?php
require('connectToDB.php');
$data = file_get_contents('php://input');
$toJSON = json_decode($data, true);
$mail = $toJSON['mail'];
$questionsAndAnswers = $toJSON['questionsAndAnswers'];
$title = $toJSON['quizzTitle'];

if ($_SESSION['sessionStatus'] != "connected" || !isset($_SESSION['mail']) || empty($_SESSION['mail']) || empty($mail) || $mail != $_SESSION['mail']) {
       $response = array('error', 'session error');
       echo json_encode($response);
       die();
} else {
       try {
              foreach ($questionsAndAnswers as $questionAndAnswers) {
                     $question = $questionAndAnswers['question'];
                     $answers = $questionAndAnswers['answers'];
                     $goodAnswers = $questionAndAnswers['correctAnswers'];

                     $insertQuizz = $db->prepare("INSERT INTO quizz (
                            title,
                            author,
                            question,
                            answer1, 
                            answer2,
                            answer3,
                            answer4,
                            `good answer1`,
                            `good answer2`,
                            `good answer3`,
                            `good answer4`)
                            
                            VALUES (
                                   :title, 
                                   :author,
                                   :question,
                                   :answer1,
                                   :answer2,
                                   :answer3,
                                   :answer4,
                                   :goodanswer1,
                                   :goodanswer2,
                                   :goodanswer3,
                                   :goodanswer4)");

                     $insertQuizz->bindParam(':title', $title);
                     $insertQuizz->bindParam(':author', $mail);
                     $insertQuizz->bindParam(':question', $question);
                     $insertQuizz->bindParam(':answer1', $answers[0]);
                     $insertQuizz->bindParam(':answer2', $answers[1]);
                     $insertQuizz->bindParam(':answer3', $answers[2]);
                     $insertQuizz->bindParam(':answer4', $answers[3]);
                     $insertQuizz->bindParam(':goodanswer1', $goodAnswers[0]);
                     $insertQuizz->bindParam(':goodanswer2', $goodAnswers[1]);
                     $insertQuizz->bindParam(':goodanswer3', $goodAnswers[2]);
                     $insertQuizz->bindParam(':goodanswer4', $goodAnswers[3]);
                     $insertQuizz->execute();
              }

              $response = array('success');
              echo json_encode($response);
       } catch (Exception $e) {
              $response = array('error', $e);
              echo json_encode($response);
       }
}
