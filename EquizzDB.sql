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

-- Listage des données de la table equizz.quizz : ~9 rows (environ)
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
  `date` datetime NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=241 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.results : ~68 rows (environ)
DELETE FROM `results`;
INSERT INTO `results` (`id`, `quizz title`, `date`, `teacher`, `student group`, `student mail`, `student number`, `question number`, `answer submitted 1`, `answer submitted 2`, `answer submitted 3`, `answer submitted 4`, `question result`) VALUES
	(173, 'QCM DE DEMO', '2023-02-21 15:24:46', 1, 'BTS SN1', 'dze@ed', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(174, 'QCM DE DEMO', '2023-02-21 15:24:46', 1, 'BTS SN1', 'dze@ed', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(175, 'QCM DE DEMO', '2023-02-21 15:24:46', 1, 'BTS SN1', 'dze@ed', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(176, 'QCM DE DEMO', '2023-02-21 15:24:46', 1, 'BTS SN1', 'dze@ed', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(177, 'QCM DE DEMO', '2023-02-21 15:24:46', 1, 'BTS SN1', 'dze@ed', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(178, 'QCM DE DEMO', '2023-02-21 15:24:46', 1, 'BTS SN1', 'dze@ed', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(179, 'QCM DE DEMO', '2023-02-21 15:24:46', 1, 'BTS SN1', 'dze@ed', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(180, 'QCM DE DEMO', '2023-02-21 00:00:00', 1, 'BTS SN1', 'fer@xn--f-wpn', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(181, 'QCM DE DEMO', '2023-02-21 00:00:00', 1, 'BTS SN1', 'fer@xn--f-wpn', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(182, 'QCM DE DEMO', '2023-02-21 00:00:00', 1, 'BTS SN1', 'fer@xn--f-wpn', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(183, 'QCM DE DEMO', '2023-02-21 00:00:00', 1, 'BTS SN1', 'fer@xn--f-wpn', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(184, 'QCM DE DEMO', '2023-02-21 00:00:00', 1, 'BTS SN1', 'fer@xn--f-wpn', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(185, 'QCM DE DEMO', '2023-02-21 00:00:00', 1, 'BTS SN1', 'fer@xn--f-wpn', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(186, 'QCM DE DEMO', '2023-02-21 16:44:46', 1, 'BTS SN1', 'ferr@ref', NULL, 1, 'Le droit de vote des femmes, en 1944', NULL, NULL, NULL, 0),
	(187, 'QCM DE DEMO', '2023-02-21 16:58:27', 1, 'BTS SN1', 'vfv@ev', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(188, 'QCM DE DEMO', '2023-02-21 16:58:27', 1, 'BTS SN1', 'vfv@ev', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(189, 'QCM DE DEMO', '2023-02-21 16:58:27', 1, 'BTS SN1', 'vfv@ev', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(190, 'QCM DE DEMO', '2023-02-21 16:58:27', 1, 'BTS SN1', 'vfv@ev', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(191, 'QCM DE DEMO', '2023-02-21 16:58:27', 1, 'BTS SN1', 'vfv@ev', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(192, 'QCM DE DEMO', '2023-02-21 16:58:27', 1, 'BTS SN1', 'vfv@ev', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(193, 'QCM DE DEMO', '2023-02-21 16:58:27', 1, 'BTS SN1', 'vfv@ev', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(194, 'QCM DE DEMO', '2023-02-21 17:00:39', 1, 'BTS SN1', 'ergr@xn--rg-7fu', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(195, 'QCM DE DEMO', '2023-02-21 17:00:39', 1, 'BTS SN1', 'ergr@xn--rg-7fu', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(196, 'QCM DE DEMO', '2023-02-21 17:00:39', 1, 'BTS SN1', 'ergr@xn--rg-7fu', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(197, 'QCM DE DEMO', '2023-02-21 17:00:39', 1, 'BTS SN1', 'ergr@xn--rg-7fu', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(198, 'QCM DE DEMO', '2023-02-21 17:00:39', 1, 'BTS SN1', 'ergr@xn--rg-7fu', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(199, 'QCM DE DEMO', '2023-02-21 17:00:39', 1, 'BTS SN1', 'ergr@xn--rg-7fu', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(200, 'QCM DE DEMO', '2023-02-21 17:00:39', 1, 'BTS SN1', 'ergr@xn--rg-7fu', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(201, 'QCM DE DEMO', '2023-02-21 17:00:39', 1, 'BTS SN1', 'ergr@xn--rg-7fu', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(202, 'QCM DE DEMO', '2023-02-21 17:03:50', 1, 'BTS SN1', 'gergg@ge', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(203, 'QCM DE DEMO', '2023-02-21 17:03:50', 1, 'BTS SN1', 'gergg@ge', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(204, 'QCM DE DEMO', '2023-02-21 17:03:50', 1, 'BTS SN1', 'gergg@ge', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(205, 'QCM DE DEMO', '2023-02-21 17:03:50', 1, 'BTS SN1', 'gergg@ge', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(206, 'QCM DE DEMO', '2023-02-21 17:03:50', 1, 'BTS SN1', 'gergg@ge', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(207, 'QCM DE DEMO', '2023-02-21 17:03:50', 1, 'BTS SN1', 'gergg@ge', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(208, 'QCM DE DEMO', '2023-02-21 17:03:50', 1, 'BTS SN1', 'gergg@ge', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(209, 'QCM DE DEMO', '2023-02-21 17:03:50', 1, 'BTS SN1', 'gergg@ge', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(210, 'QCM DE DEMO', '2023-02-21 17:06:41', 1, 'BTS SN1', 'ergr@reg', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(211, 'QCM DE DEMO', '2023-02-21 17:06:41', 1, 'BTS SN1', 'ergr@reg', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(212, 'QCM DE DEMO', '2023-02-21 17:06:41', 1, 'BTS SN1', 'ergr@reg', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(213, 'QCM DE DEMO', '2023-02-21 17:06:41', 1, 'BTS SN1', 'ergr@reg', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(214, 'QCM DE DEMO', '2023-02-21 17:06:41', 1, 'BTS SN1', 'ergr@reg', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(215, 'QCM DE DEMO', '2023-02-21 17:06:41', 1, 'BTS SN1', 'ergr@reg', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(216, 'QCM DE DEMO', '2023-02-21 17:06:41', 1, 'BTS SN1', 'ergr@reg', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(217, 'QCM DE DEMO', '2023-02-21 17:06:41', 1, 'BTS SN1', 'ergr@reg', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(218, 'QCM DE DEMO', '2023-02-21 17:07:11', 1, 'BTS SN1', 'erfv@frg', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(219, 'QCM DE DEMO', '2023-02-21 17:07:11', 1, 'BTS SN1', 'erfv@frg', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(220, 'QCM DE DEMO', '2023-02-21 17:07:11', 1, 'BTS SN1', 'erfv@frg', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(221, 'QCM DE DEMO', '2023-02-21 17:07:11', 1, 'BTS SN1', 'erfv@frg', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(222, 'QCM DE DEMO', '2023-02-21 17:07:11', 1, 'BTS SN1', 'erfv@frg', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(223, 'QCM DE DEMO', '2023-02-21 17:07:11', 1, 'BTS SN1', 'erfv@frg', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(224, 'QCM DE DEMO', '2023-02-21 17:07:11', 1, 'BTS SN1', 'erfv@frg', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(225, 'QCM DE DEMO', '2023-02-21 17:07:11', 1, 'BTS SN1', 'erfv@frg', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(226, 'QCM DE DEMO', '2023-02-21 17:47:00', 1, 'BTS SN2', 'erfe@xn--f-wpn', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(227, 'QCM DE DEMO', '2023-02-21 19:40:00', 1, 'BTS SN1', 'zefze@ef', NULL, 1, 'Le droit de vote des femmes, en 1944', NULL, NULL, NULL, 0),
	(228, 'QCM DE DEMO', '2023-02-21 19:40:00', 1, 'BTS SN1', 'ef@ef', NULL, 2, '11', NULL, NULL, NULL, 1),
	(229, 'QCM DE DEMO', '2023-02-21 19:40:00', 1, 'BTS SN1', 'ef@ef', NULL, 3, 'Opération tonnerre (James Bond, 1965)', 'MI6 : Secret Intelligence Service. Royaume-Unis', 'Kali Linux', '', 0),
	(230, 'QCM DE DEMO', '2023-02-21 19:40:00', 1, 'BTS SN1', 'ef@ef', NULL, 4, 'Un langages à typage dynamique', 'Un langage basé objet', 'Un langage qui permet de faire des requêtes SQL sur une DB', NULL, 1),
	(231, 'QCM DE DEMO', '2023-02-21 20:10:44', 1, 'BTS SN1', 'sdvcefv@v', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(232, 'QCM DE DEMO', '2023-02-21 20:10:44', 1, 'BTS SN1', 'sdvcefv@v', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(233, 'QCM DE DEMO', '2023-02-21 20:10:44', 1, 'BTS SN1', 'sdvcefv@v', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(234, 'QCM DE DEMO', '2023-02-23 22:41:20', 1, 'BTS SN1', 'craefe@efef.Ef', NULL, 1, 'La prise de la Bastille, en 1789', NULL, NULL, NULL, 1),
	(235, 'QCM DE DEMO', '2023-02-23 22:41:20', 1, 'BTS SN1', 'craefe@efef.Ef', NULL, 2, '11', NULL, NULL, NULL, 1),
	(236, 'QCM DE DEMO', '2023-02-23 22:41:20', 1, 'BTS SN1', 'craefe@efef.Ef', NULL, 3, 'MI6 : Secret Intelligence Service. Royaume-Unis', NULL, NULL, NULL, 0),
	(237, 'QCM DE DEMO', '2023-02-23 22:41:20', 1, 'BTS SN1', 'craefe@efef.Ef', NULL, 4, 'Un langage qui permet de faire des requêtes SQL sur une DB', NULL, NULL, NULL, 0),
	(238, 'QCM DE DEMO', '2023-02-23 22:41:20', 1, 'BTS SN1', 'craefe@efef.Ef', NULL, 5, 'François Mitterand', NULL, NULL, NULL, 0),
	(239, 'QCM DE DEMO', '2023-02-23 22:41:20', 1, 'BTS SN1', 'craefe@efef.Ef', NULL, 6, 'Mort d\'Oussama Ben Laden sur le sol Américain, après 4 années de chasse à l\'homme', NULL, NULL, NULL, 0),
	(240, 'QCM DE DEMO', '2023-02-23 22:41:20', 1, 'BTS SN1', 'craefe@efef.Ef', NULL, 7, '', NULL, NULL, NULL, 0);

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
