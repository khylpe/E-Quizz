
<?php

// This file is used to fetch the results of a student for a teacher.
// End user simply has to start typing in the text input and the results will be displayed in a table below.

require('connectToDB.php');
$mail = file_get_contents('php://input');
$mail = '%' . $mail . '%';
$arrayResult = array();
try {
       $fetchQuizzList = $db->prepare("SELECT * FROM results WHERE teacher = :uid AND `student mail` LIKE :studentMail");
       $fetchQuizzList->execute(array(':uid' => $_SESSION['uid'], ':studentMail' => $mail));

       $results = $fetchQuizzList->fetchAll(PDO::FETCH_ASSOC);
       $finalArray = array();

       // Iterate through the fetched results
       foreach ($results as $result) {
              $studentMail = $result['student mail'];
              $quizzTitle = $result['quizz title'];
              $questionResult = $result['question result'];
              $date = $result['date'];
              $groupName = $result['student group'];
              
              // Check if the student mail already exists in the final array
              $found = false;
              foreach ($finalArray as &$student) {
                     if ($student['studentMail'] === $studentMail) {
                            $found = true;

                            // Check if the quizz title already exists for this student
                            $quizzFound = false;
                            foreach ($student['quizzResults'] as &$quizzResult) {
                                   if ($quizzResult['quizzName'] === $quizzTitle && $quizzResult['date'] === $date) {
                                          $quizzFound = true;
                                          $quizzResult['numberOfQuestions']++;
                                          $quizzResult['numberOfGoodAnswer'] += $questionResult;
                                          break;
                                   }
                            }

                            // If the quizz title is not found for this student, add a new quizz result
                            if (!$quizzFound) {
                                   $student['quizzResults'][] = array(
                                          'quizzName' => $quizzTitle,
                                          'numberOfGoodAnswer' => $questionResult,
                                          'numberOfQuestions' => 1,
                                          'date' => $date,
                                          'groupName' => $groupName
                                   );
                            }
                            break;
                     }
              }

              // If the student mail is not found, add a new student entry to the final array
              if (!$found) {
                     $finalArray[] = array(
                            'studentMail' => $studentMail,
                            'quizzResults' => array(
                                   array(
                                          'quizzName' => $quizzTitle,
                                          'numberOfGoodAnswer' => $questionResult,
                                          'numberOfQuestions' => 1,
                                          'date' => $date,
                                          'groupName' => $groupName
                                   )
                            )
                     );
              }
       }
              $response = array('success', $finalArray);
              echo json_encode($response);
} catch (Exception $e) {
       $response = array('error', $e);
       echo json_encode($response);
}
