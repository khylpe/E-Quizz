-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.30 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.1.0.6537
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
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `author` int NOT NULL,
  `question` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `answer1` varchar(100) DEFAULT NULL,
  `answer2` varchar(100) DEFAULT NULL,
  `answer3` varchar(100) DEFAULT NULL,
  `answer4` varchar(100) DEFAULT NULL,
  `good answer1` varchar(100) DEFAULT NULL,
  `good answer2` varchar(100) DEFAULT NULL,
  `good answer3` varchar(100) DEFAULT NULL,
  `good answer4` varchar(100) DEFAULT NULL,
  `question number` int DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `uid` (`author`),
  CONSTRAINT `uid` FOREIGN KEY (`author`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.quizz : ~13 rows (environ)
DELETE FROM `quizz`;
INSERT INTO `quizz` (`id`, `title`, `author`, `question`, `answer1`, `answer2`, `answer3`, `answer4`, `good answer1`, `good answer2`, `good answer3`, `good answer4`, `question number`) VALUES
	(115, 'DEMO', 1, 'Quelle est la capitale de la France', 'Marseille', 'Ottawa', 'Paris', 'Tokyo', 'Paris', NULL, NULL, NULL, 0),
	(116, 'création quizz 1', 1, 'Q', '1', '5', '3', '4', '5', NULL, NULL, NULL, 0),
	(117, 'DEMO', 2, 'Quelle est la capitale du Canada', 'Marseille', 'Ottawa', 'Paris', 'Tokyo', 'Ottawa', NULL, NULL, NULL, 0),
	(118, 'DEMO', 1, 'Quelle est la capitale du Canada', 'Marseille', 'Ottawa', 'Paris', 'Tokyo', 'Ottawa', NULL, NULL, NULL, 0),
	(119, 'DEMO', 2, 'Quelle est la capitale de la France', 'Marseille', 'Ottawa', 'Paris', 'Tokyo', 'Paris', NULL, NULL, NULL, 0),
	(120, 'QCM DE DEMO', 1, 'Que fêtons-nous le 14 Juillet ?', 'La prise de la Bastille, en 1789', 'L\'armistice de 1918', 'Le droit de vote des femmes, en 1944', 'L\'assomption', 'La prise de la Bastille, en 1789', NULL, NULL, NULL, 1),
	(121, 'QCM DE DEMO', 1, '"1"+1 en JavaScript', '2', '1', '11', 'NaN', '11', NULL, NULL, NULL, 2),
	(122, 'QCM DE DEMO', 1, 'D\'où vient le slogan "The quieter you become, the more you are able to hear"', 'Opération tonnerre (James Bond, 1965)', 'MI6 : Secret Intelligence Service. Royaume-Unis', 'Kali Linux', '', 'Kali Linux', NULL, NULL, NULL, 3),
	(123, 'QCM DE DEMO', 1, 'Le JavaScript est ', 'Un langages à typage dynamique', 'Un langage basé objet', 'Un langage orienté objet', 'Un langage qui permet de faire des requêtes SQL sur une DB', 'Un langages à typage dynamique', 'Un langage basé objet', 'Un langage qui permet de faire des requêtes SQL sur une DB', NULL, 4),
	(124, 'QCM DE DEMO', 1, 'Qui était le président de la France de 1995 à 2007 ?', 'Georges Pompidou', 'Jacques Chirac ', 'François Hollande', 'François Mitterand', 'Jacques Chirac ', NULL, NULL, NULL, 5),
	(125, 'QCM DE DEMO', 1, 'Quels événements se sont produis après les attaques du 11 septembre 2001 à New York', 'Fin de la politique isolationniste pour les USA', ' les Américains lancent une offensive en Afghanistan (lutte anti-terroriste)', 'Les USA deviennent "les gendarmes du monde"', 'Mort d\'Oussama Ben Laden sur le sol Américain, après 4 années de chasse à l\'homme', ' les Américains lancent une offensive en Afghanistan (lutte anti-terroriste)', 'Les USA deviennent "les gendarmes du monde"', NULL, NULL, 6),
	(126, 'QCM DE DEMO', 1, 'Quel est le "bug de l\'an 2000"', 'Un bug concernant les formats des dates informatiques', 'Un bug concernant le World Wide Web', '', '', 'Un bug concernant les formats des dates informatiques', NULL, NULL, NULL, 7),
	(127, 'QCM DE DEMO', 1, 'Quelle bataille mena à la chute de Napoléon Bonaparte', 'Bataille de Verdun', 'Bataille de Stalingrad', 'Bataille de la somme', 'Bataille de waterloo', 'Bataille de waterloo', NULL, NULL, NULL, 8);

-- Listage de la structure de table equizz. results
CREATE TABLE IF NOT EXISTS `results` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `quizz title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date` date NOT NULL,
  `teacher` int NOT NULL,
  `student group` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `student mail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `student number` int DEFAULT NULL,
  `question number` int NOT NULL,
  `answer submitted 1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `answer submitted 2` varchar(100) DEFAULT NULL,
  `answer submitted 3` varchar(100) DEFAULT NULL,
  `answer submitted 4` varchar(100) DEFAULT NULL,
  `question result` tinyint unsigned NOT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `uidForResult` (`teacher`),
  CONSTRAINT `uidForResult` FOREIGN KEY (`teacher`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.results : ~0 rows (environ)
DELETE FROM `results`;

-- Listage de la structure de table equizz. student group
CREATE TABLE IF NOT EXISTS `student group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.student group : ~2 rows (environ)
DELETE FROM `student group`;
INSERT INTO `student group` (`id`, `name`) VALUES
	(1, 'BTS SN1'),
	(2, 'BTS SN2');

-- Listage de la structure de table equizz. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.user : ~2 rows (environ)
DELETE FROM `user`;
INSERT INTO `user` (`id`, `mail`, `password`) VALUES
	(1, 'crahe.arthur@gmail.com', 'arthur'),
	(2, 'test.test@gmail.com', 'test');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
