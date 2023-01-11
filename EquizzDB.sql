-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.31 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour equizz
CREATE DATABASE IF NOT EXISTS `equizz` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `equizz`;

-- Listage de la structure de table equizz. quizz
CREATE TABLE IF NOT EXISTS `quizz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `author` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `question` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `answer1` varchar(100) DEFAULT NULL,
  `answer2` varchar(100) DEFAULT NULL,
  `answer3` varchar(100) DEFAULT NULL,
  `answer4` varchar(100) DEFAULT NULL,
  `good answer1` varchar(100) DEFAULT NULL,
  `good answer2` varchar(100) DEFAULT NULL,
  `good answer3` varchar(100) DEFAULT NULL,
  `good answer4` varchar(100) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.quizz : ~4 rows (environ)
DELETE FROM `quizz`;
INSERT INTO `quizz` (`id`, `title`, `author`, `question`, `answer1`, `answer2`, `answer3`, `answer4`, `good answer1`, `good answer2`, `good answer3`, `good answer4`) VALUES
	(1, 'Quizz de teste 1', 'crahe.arthur@gmail.com', 'Comment s\'appelle la personne dont le prénom est Arthur', 'Ahmed', 'Esteban', 'Tristan', 'Arthur', 'Arthur', NULL, NULL, NULL),
	(2, 'Quizz de teste 1', 'crahe.arthur@gmail.com', 'Comment s\'appelle la personne dont le prénom est Tristan', 'Ahmed', 'Esteban', 'Tristan', 'Arthur', 'Tristan', NULL, NULL, NULL),
	(3, 'Quizz de teste 1', 'crahe.arthur@gmail.com', 'Comment s\'appelle la personne dont le prénom est Esteban', 'Ahmed', 'Esteban', 'Tristan', 'Arthur', 'Esteban', NULL, NULL, NULL),
	(4, 'Quizz de teste 1', 'crahe.arthur@gmail.com', 'Comment s\'appelle la personne dont le prénom est Ahmed', 'Ahmed', 'Esteban', 'Tristan', 'Arthur', 'Ahmed', NULL, NULL, NULL);

-- Listage de la structure de table equizz. results
CREATE TABLE IF NOT EXISTS `results` (
  `quizz title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `quizz number` int unsigned NOT NULL,
  `date` date NOT NULL,
  `teacher` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `student group` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `student` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `question number` int NOT NULL,
  `answer submitted` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `question result` tinyint unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.results : ~0 rows (environ)
DELETE FROM `results`;

-- Listage de la structure de table equizz. student group
CREATE TABLE IF NOT EXISTS `student group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.student group : ~0 rows (environ)
DELETE FROM `student group`;

-- Listage de la structure de table equizz. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.user : ~1 rows (environ)
DELETE FROM `user`;
INSERT INTO `user` (`id`, `mail`, `password`) VALUES
	(1, 'crahe.arthur@gmail.com', 'arthur');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
