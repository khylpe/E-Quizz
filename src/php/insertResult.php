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
              $fetchQuizzList = $db->prepare("INSERT INTO results (
                     `quizz title`,
                     `date`,
                     `teacher`,
                     `student group`,
                     `studentMailOrNumber`,
                     `question number`,
                     `answer submitted 1`,
                     `answer submitted 2`,
                     `answer submitted 3`,
                     `answer submitted 4`,
                     `question result`)

                     VALUES (
                            :quizzTitle,
                            :dateSubmit,
                            :teacher,
                            :studentGroup,
                            :studentMail,
                            :questionNumber,
                            :answerSubmitted1,
                            :answerSubmitted2,
                            :answerSubmitted3,
                            :answerSubmitted4,
                            :questionResult
                            )");

              $fetchQuizzList->bindParam(':quizzTitle', $data['quizzTitle']);
              $fetchQuizzList->bindParam(':dateSubmit', $data['time']);
              $fetchQuizzList->bindParam(':teacher', $_SESSION['uid']);
              $fetchQuizzList->bindParam(':studentGroup', $data['groupName']);
              $fetchQuizzList->bindParam(':studentMail', $data['studentMail']);
              $fetchQuizzList->bindParam(':questionNumber', $data['questionNumber']);
              $fetchQuizzList->bindParam(':answerSubmitted1', $data['studentAnswers'][0]);
              $fetchQuizzList->bindParam(':answerSubmitted2', $data['studentAnswers'][1]);
              $fetchQuizzList->bindParam(':answerSubmitted3', $data['studentAnswers'][2]);
              $fetchQuizzList->bindParam(':answerSubmitted4', $data['studentAnswers'][3]);
              if($data['resultQuestion'] == "true")
                     $data['resultQuestion'] = 1;
              else
                     $data['resultQuestion'] = 0;
              $fetchQuizzList->bindParam(':questionResult', $data['resultQuestion']);
              
              $fetchQuizzList->execute();
              
              $response = array('success');
              echo json_encode($response);
       } catch (Exception $e) {
              $response = array('error', $e);
              echo json_encode($response);
       }
}
