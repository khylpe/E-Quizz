-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.30 - MySQL Community Server - GPL
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
  `question number` int unsigned DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `uid` (`author`),
  CONSTRAINT `uid` FOREIGN KEY (`author`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.quizz : ~8 rows (environ)
DELETE FROM `quizz`;
INSERT INTO `quizz` (`id`, `title`, `author`, `question`, `answer1`, `answer2`, `answer3`, `answer4`, `good answer1`, `good answer2`, `good answer3`, `good answer4`, `question number`) VALUES
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
  `question number` int unsigned NOT NULL,
  `answer submitted 1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `answer submitted 2` varchar(100) DEFAULT NULL,
  `answer submitted 3` varchar(100) DEFAULT NULL,
  `answer submitted 4` varchar(100) DEFAULT NULL,
  `question result` tinyint(1) NOT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `uidForResult` (`teacher`),
  CONSTRAINT `uidForResult` FOREIGN KEY (`teacher`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.results : ~21 rows (environ)
DELETE FROM `results`;
INSERT INTO `results` (`id`, `quizz title`, `date`, `teacher`, `student group`, `student mail`, `student number`, `question number`, `answer submitted 1`, `answer submitted 2`, `answer submitted 3`, `answer submitted 4`, `question result`) VALUES
	(84, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'cree.ege@eg', NULL, 1, 'Le droit de vote des femmes, en 1944', NULL, NULL, NULL, 0),
	(85, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'cree.ege@eg', NULL, 2, 'NaN', NULL, NULL, NULL, 0),
	(86, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'cree.ege@eg', NULL, 3, 'Kali Linux', NULL, NULL, NULL, 1),
	(87, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'cree.ege@eg', NULL, 4, 'Un langage qui permet de faire des requêtes SQL sur une DB', NULL, NULL, NULL, 0),
	(88, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'cree.ege@eg', NULL, 5, 'François Mitterand', NULL, NULL, NULL, 0),
	(89, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'cree.ege@eg', NULL, 6, 'Les USA deviennent "les gendarmes du monde"', NULL, NULL, NULL, 0),
	(90, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'cree.ege@eg', NULL, 7, 'Un bug concernant le World Wide Web', NULL, NULL, NULL, 0),
	(91, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'ezf@ef.erf', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(92, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'ezf@ef.erf', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(93, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'ezf@ef.erf', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(94, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'ezf@ef.erf', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(95, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'ezf@ef.erf', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(96, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'ezf@ef.erf', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(97, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'ezf@ef.erf', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(98, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'fez@ezf', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(99, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'fez@ezf', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(100, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'fez@ezf', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(101, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'fez@ezf', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(102, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'fez@ezf', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(103, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'fez@ezf', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(104, 'QCM DE DEMO', '2023-02-20', 1, 'BTS SN1', 'fez@ezf', NULL, 7, NULL, NULL, NULL, NULL, 0);

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
