<?php

require('connectToDB.php');
$entityBody = file_get_contents('php://input');
$data = json_decode($entityBody, true);

$groupName = $data['groupName'];

if ($_SESSION['sessionStatus'] != "connected" || !isset($_SESSION['mail']) || empty($_SESSION['mail'])) {
       $response = array('error', 'session error');
       echo json_encode($response);
       die();
} else {
       try {
              $checkIfGroupNameAlreadyExists = $db->prepare("SELECT * FROM `student group` WHERE `name` = :groupName");
              $checkIfGroupNameAlreadyExists->bindParam(':groupName', $groupName);
              $checkIfGroupNameAlreadyExists->execute();
              $checkIfGroupNameAlreadyExists = $checkIfGroupNameAlreadyExists->fetchAll(PDO::FETCH_ASSOC);

              if(count($checkIfGroupNameAlreadyExists) > 0) {
                     $response = array('error', 'group name already exists');
                     echo json_encode($response);
                     die();
              }

              else{
                     $insertGroupName = $db->prepare("INSERT INTO `student group` (`name`) VALUES (:groupName)");
                     $insertGroupName->bindParam(':groupName', $groupName);
                     $insertGroupName->execute();
       
                     $response = array('success');
                     echo json_encode($response);
              }
              
       } catch (Exception $e) {
              $response = array('error', $e);
              echo json_encode($response);
       }
}