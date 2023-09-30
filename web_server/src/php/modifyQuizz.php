<?php
require('connectToDB.php');
$data = file_get_contents('php://input');
$toJSON = json_decode($data, true);
$mail = $toJSON['mail'];
$questionsAndAnswers = $toJSON['questionsAndAnswers'];
$title = $toJSON['quizzTitle'];
$quizzNumber = $toJSON['quizzNumber'];


if ($_SESSION['sessionStatus'] != "connected" || !isset($_SESSION['mail']) || empty($_SESSION['mail']) || empty($mail) || $mail != $_SESSION['mail']) {
       $response = array('error', 'session error');
       echo json_encode($response);
       die();
} else {
       try{
              $deleteQuizz = $db->prepare("DELETE FROM quizz WHERE `quizz number` = :quizzNumber AND author = :author");
              $deleteQuizz->bindParam(':quizzNumber', $quizzNumber);
              $deleteQuizz->bindParam(':author', $_SESSION['uid']);
              $deleteQuizz->execute();
       }
       catch (Exception $e) {
              $response = array('error', $e);
              echo json_encode($response);
              die();
       }
       try {
              $questionNumber = 1;
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
                            `good answer4`,
                            `question number`,
                            `quizz number`
                            )
                            
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
                                   :goodanswer4,
                                   :questionNumber,
                                   :quizzNumber
                                   )");

                     $insertQuizz->bindParam(':title', $title);
                     $insertQuizz->bindParam(':author', $_SESSION['uid']);
                     $insertQuizz->bindParam(':question', $question);
                     $insertQuizz->bindParam(':answer1', $answers[0]);
                     $insertQuizz->bindParam(':answer2', $answers[1]);
                     $insertQuizz->bindParam(':answer3', $answers[2]);
                     $insertQuizz->bindParam(':answer4', $answers[3]);
                     $insertQuizz->bindParam(':goodanswer1', $goodAnswers[0]);
                     $insertQuizz->bindParam(':goodanswer2', $goodAnswers[1]);
                     $insertQuizz->bindParam(':goodanswer3', $goodAnswers[2]);
                     $insertQuizz->bindParam(':goodanswer4', $goodAnswers[3]);
                     $insertQuizz->bindParam(':questionNumber', $questionNumber);
                     $insertQuizz->bindParam(':quizzNumber', $quizzNumber);
                     $insertQuizz->execute();

                     $questionNumber++;
              }

              $response = array('success', 'le Quizz a été créé');
              echo json_encode($response);
              
       } catch (Exception $e) {
              $response = array('error', $e);
              echo json_encode($response);
       }
}
