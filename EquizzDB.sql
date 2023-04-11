-- --------------------------------------------------------
-- Hôte :                        127.0.0.1
-- Version du serveur:           8.0.30 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour equizz
CREATE DATABASE IF NOT EXISTS `equizz` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `equizz`;

-- Listage de la structure de la table equizz. quizz
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
  `quizz number` int unsigned DEFAULT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `uid` (`author`),
  CONSTRAINT `uid` FOREIGN KEY (`author`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.quizz : ~43 rows (environ)
DELETE FROM `quizz`;
/*!40000 ALTER TABLE `quizz` DISABLE KEYS */;
INSERT INTO `quizz` (`id`, `title`, `author`, `question`, `answer1`, `answer2`, `answer3`, `answer4`, `good answer1`, `good answer2`, `good answer3`, `good answer4`, `question number`, `quizz number`) VALUES
	(120, 'QCM DE DEMO', 1, 'Que fêtons-nous le 14 Juillet ?', 'La prise de la Bastille, en 1789', 'L\'armistice de 1918', 'Le droit de vote des femmes, en 1944', 'L\'assomption', 'La prise de la Bastille, en 1789', NULL, NULL, NULL, 1, NULL),
	(121, 'QCM DE DEMO', 1, '"1"+1 en JavaScript', '2', '1', '11', 'NaN', '11', NULL, NULL, NULL, 2, NULL),
	(122, 'QCM DE DEMO', 1, 'D\'où vient le slogan "The quieter you become, the more you are able to hear"', 'Opération tonnerre (James Bond, 1965)', 'MI6 : Secret Intelligence Service. Royaume-Unis', 'Kali Linux', '', 'Kali Linux', NULL, NULL, NULL, 3, NULL),
	(123, 'QCM DE DEMO', 1, 'Le JavaScript est ', 'Un langages à typage dynamique', 'Un langage basé objet', 'Un langage orienté objet', 'Un langage qui permet de faire des requêtes SQL sur une DB', 'Un langages à typage dynamique', 'Un langage basé objet', 'Un langage qui permet de faire des requêtes SQL sur une DB', NULL, 4, NULL),
	(124, 'QCM DE DEMO', 1, 'Qui était le président de la France de 1995 à 2007 ?', 'Georges Pompidou', 'Jacques Chirac ', 'François Hollande', 'François Mitterand', 'Jacques Chirac ', NULL, NULL, NULL, 5, NULL),
	(125, 'QCM DE DEMO', 1, 'Quels événements se sont produis après les attaques du 11 septembre 2001 à New York', 'Fin de la politique isolationniste pour les USA', ' les Américains lancent une offensive en Afghanistan (lutte anti-terroriste)', 'Les USA deviennent "les gendarmes du monde"', 'Mort d\'Oussama Ben Laden sur le sol Américain, après 4 années de chasse à l\'homme', ' les Américains lancent une offensive en Afghanistan (lutte anti-terroriste)', 'Les USA deviennent "les gendarmes du monde"', NULL, NULL, 6, NULL),
	(126, 'QCM DE DEMO', 1, 'Quel est le "bug de l\'an 2000"', 'Un bug concernant les formats des dates informatiques', 'Un bug concernant le World Wide Web', '', '', 'Un bug concernant les formats des dates informatiques', NULL, NULL, NULL, 7, NULL),
	(127, 'QCM DE DEMO', 1, 'Quelle bataille mena à la chute de Napoléon Bonaparte', 'Bataille de Verdun', 'Bataille de Stalingrad', 'Bataille de la somme', 'Bataille de waterloo', 'Bataille de waterloo', NULL, NULL, NULL, 8, NULL),
	(194, 'salut test 1', 1, 'salut test 1 question 1', 'salut test 1 rep 1', 'salut test 1 rep 2', '', '', 'salut test 1 rep 1', NULL, NULL, NULL, 1, 1),
	(195, 'salut test 2', 1, 'salut test 1 question', 'salut test 1 rep 1', 'salut test 1 rep 2', '', '', 'salut test 1 rep 1', NULL, NULL, NULL, 1, 2),
	(196, 'ezfezezffez', 1, 'ezfezfezf', 'fezfezf', 'zefezf', '', '', 'fezfezf', NULL, NULL, NULL, 1, 3),
	(197, 'test', 1, 'zezffz', 'zefez', 'zfezf', '', '', 'zefez', NULL, NULL, NULL, 1, 4),
	(202, 'ntm', 1, 'question1', 'rep1', 'rep2', '', '', 'rep1', NULL, NULL, NULL, 1, 5),
	(203, 'ntm', 1, 'question2', 'rep1', 'rep2', '', '', 'rep2', NULL, NULL, NULL, 2, 5);
/*!40000 ALTER TABLE `quizz` ENABLE KEYS */;

-- Listage de la structure de la table equizz. results
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
  `answer submitted 4` varchar(100),
  `question result` tinyint(1) NOT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `uidForResult` (`teacher`),
  CONSTRAINT `uidForResult` FOREIGN KEY (`teacher`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2257 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.results : ~147 rows (environ)
DELETE FROM `results`;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` (`id`, `quizz title`, `date`, `teacher`, `student group`, `student mail`, `student number`, `question number`, `answer submitted 1`, `answer submitted 2`, `answer submitted 3`, `answer submitted 4`, `question result`) VALUES
	(2062, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rthtr@rthtrhrht', NULL, 1, 'La prise de la Bastille, en 1789', NULL, NULL, NULL, 1),
	(2063, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rh@rth', NULL, 1, 'La prise de la Bastille, en 1789', NULL, NULL, NULL, 1),
	(2064, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rh@rth', NULL, 2, '2', '1', '11', 'NaN', 0),
	(2065, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rthtr@rthtrhrht', NULL, 2, '2', NULL, NULL, NULL, 0),
	(2066, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rh@rth', NULL, 3, 'Opération tonnerre (James Bond, 1965)', 'Kali Linux', NULL, NULL, 0),
	(2067, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rthtr@rthtrhrht', NULL, 3, 'Opération tonnerre (James Bond, 1965)', 'Kali Linux', '', NULL, 0),
	(2068, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rh@rth', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2069, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rthtr@rthtrhrht', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2070, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rthtr@rthtrhrht', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2071, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rh@rth', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2072, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rthtr@rthtrhrht', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2073, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rh@rth', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2074, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rthtr@rthtrhrht', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2075, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rh@rth', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2076, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rthtr@rthtrhrht', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2077, 'QCM DE DEMO', '2023-03-20 10:46:45', 1, 'BTS SN1', 'rh@rth', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2078, 'QCM DE DEMO', '2023-03-20 14:18:36', 1, 'BTS SN1', 'a@a', NULL, 1, 'La prise de la Bastille, en 1789', NULL, NULL, NULL, 1),
	(2079, 'QCM DE DEMO', '2023-03-20 14:18:36', 1, 'BTS SN1', 'a@a', NULL, 3, 'Opération tonnerre (James Bond, 1965)', NULL, NULL, NULL, 0),
	(2080, 'QCM DE DEMO', '2023-03-20 14:18:36', 1, 'BTS SN1', 'a@a', NULL, 2, '11', NULL, NULL, NULL, 1),
	(2081, 'QCM DE DEMO', '2023-03-20 14:18:36', 1, 'BTS SN1', 'a@a', NULL, 5, 'François Hollande', NULL, NULL, NULL, 0),
	(2082, 'QCM DE DEMO', '2023-03-20 14:18:36', 1, 'BTS SN1', 'a@a', NULL, 4, 'Un langage orienté objet', NULL, NULL, NULL, 0),
	(2083, 'QCM DE DEMO', '2023-03-20 14:18:36', 1, 'BTS SN1', 'a@a', NULL, 6, ' les Américains lancent une offensive en Afghanistan (lutte anti-terroriste)', NULL, NULL, NULL, 0),
	(2085, 'QCM DE DEMO', '2023-03-20 14:18:36', 1, 'BTS SN1', 'a@a', NULL, 8, 'Bataille de waterloo', NULL, NULL, NULL, 1),
	(2086, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'a@a', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2087, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'b@bbbb', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2088, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'b@bbbb', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2089, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'a@a', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2090, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'a@a', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2091, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'b@bbbb', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2092, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'a@a', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2093, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'b@bbbb', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2094, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'b@bbbb', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2095, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'a@a', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2096, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'a@a', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2097, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'b@bbbb', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2098, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'b@bbbb', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2099, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'a@a', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2100, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'b@bbbb', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2101, 'QCM DE DEMO', '2023-03-20 14:51:16', 1, 'BTS SN1', 'a@a', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2102, 'QCM DE DEMO', '2023-03-20 16:16:42', 1, 'BTS SN1', 'a@a', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2103, 'QCM DE DEMO', '2023-03-20 16:16:42', 1, 'BTS SN1', 'a@a', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2104, 'QCM DE DEMO', '2023-03-20 16:16:42', 1, 'BTS SN1', 'a@a', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2105, 'QCM DE DEMO', '2023-03-20 16:16:42', 1, 'BTS SN1', 'a@a', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2106, 'QCM DE DEMO', '2023-03-20 16:16:42', 1, 'BTS SN1', 'a@a', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2107, 'QCM DE DEMO', '2023-03-20 16:16:42', 1, 'BTS SN1', 'a@a', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2108, 'QCM DE DEMO', '2023-03-20 16:16:42', 1, 'BTS SN1', 'a@a', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2109, 'QCM DE DEMO', '2023-03-20 16:16:42', 1, 'BTS SN1', 'a@a', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2110, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2111, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2112, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2113, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2114, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2115, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2116, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2117, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2118, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2119, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2120, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2121, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2122, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2123, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2124, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2125, 'QCM DE DEMO', '2023-03-20 16:22:21', 1, 'BTS SN1', 'a@a', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2126, 'QCM DE DEMO', '2023-03-20 16:26:24', 1, 'BTS SN1', 'a@a', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2127, 'QCM DE DEMO', '2023-03-20 16:26:24', 1, 'BTS SN1', 'a@a', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2128, 'QCM DE DEMO', '2023-03-20 16:26:24', 1, 'BTS SN1', 'a@a', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2129, 'QCM DE DEMO', '2023-03-20 16:26:24', 1, 'BTS SN1', 'a@a', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2130, 'QCM DE DEMO', '2023-03-20 16:26:24', 1, 'BTS SN1', 'a@a', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2131, 'QCM DE DEMO', '2023-03-20 16:26:24', 1, 'BTS SN1', 'a@a', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2132, 'QCM DE DEMO', '2023-03-20 16:26:24', 1, 'BTS SN1', 'a@a', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2133, 'QCM DE DEMO', '2023-03-20 16:26:24', 1, 'BTS SN1', 'a@a', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2134, 'QCM DE DEMO', '2023-03-23 08:47:18', 1, 'BTS SN1', 'reg@erg', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2135, 'QCM DE DEMO', '2023-03-23 08:47:18', 1, 'BTS SN1', 'reg@erg', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2136, 'QCM DE DEMO', '2023-03-23 08:47:18', 1, 'BTS SN1', 'reg@erg', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2137, 'QCM DE DEMO', '2023-03-23 08:47:18', 1, 'BTS SN1', 'reg@erg', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2138, 'QCM DE DEMO', '2023-03-23 08:47:18', 1, 'BTS SN1', 'reg@erg', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2139, 'QCM DE DEMO', '2023-03-23 08:47:18', 1, 'BTS SN1', 'reg@erg', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2140, 'QCM DE DEMO', '2023-03-23 08:47:18', 1, 'BTS SN1', 'reg@erg', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2141, 'QCM DE DEMO', '2023-03-23 08:47:18', 1, 'BTS SN1', 'reg@erg', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2142, 'QCM DE DEMO', '2023-03-27 11:14:18', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2143, 'QCM DE DEMO', '2023-03-27 11:14:18', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2144, 'QCM DE DEMO', '2023-03-27 11:14:18', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2145, 'QCM DE DEMO', '2023-03-27 11:14:18', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2146, 'QCM DE DEMO', '2023-03-27 11:14:18', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2147, 'QCM DE DEMO', '2023-03-27 11:14:18', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2148, 'QCM DE DEMO', '2023-03-27 11:14:18', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2149, 'QCM DE DEMO', '2023-03-27 11:14:18', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2150, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2151, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'slt@slt', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2152, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'slt@slt', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2153, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2154, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'slt@slt', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2155, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2156, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2157, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2158, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'slt@slt', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2159, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'slt@slt', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2160, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'slt@slt', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2161, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2162, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2163, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'slt@slt', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2164, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'erg@xn--rg-7fu', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2165, 'QCM DE DEMO', '2023-03-27 13:09:25', 1, 'BTS SN1', 'slt@slt', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2174, 'QCM DE DEMO', '2023-03-27 13:11:23', 1, 'BTS SN1', 'test@test', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2175, 'QCM DE DEMO', '2023-03-27 13:11:23', 1, 'BTS SN1', 'test@test', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2176, 'QCM DE DEMO', '2023-03-27 13:11:23', 1, 'BTS SN1', 'test@test', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2177, 'QCM DE DEMO', '2023-03-27 13:11:23', 1, 'BTS SN1', 'test@test', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2178, 'QCM DE DEMO', '2023-03-27 13:11:23', 1, 'BTS SN1', 'test@test', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2179, 'QCM DE DEMO', '2023-03-27 13:11:23', 1, 'BTS SN1', 'test@test', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2180, 'QCM DE DEMO', '2023-03-27 13:11:23', 1, 'BTS SN1', 'test@test', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2181, 'QCM DE DEMO', '2023-03-27 13:11:23', 1, 'BTS SN1', 'test@test', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2182, 'test', '2023-03-27 13:12:36', 1, 'BTS SN1', 'test@test', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2183, 'test', '2023-03-27 13:12:36', 1, 'BTS SN1', 'test@test', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2184, 'test', '2023-03-27 13:12:36', 1, 'BTS SN1', 'test@test', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2185, 'QCM DE DEMO', '2023-03-27 13:13:02', 1, 'BTS SN1', 'test@test', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2186, 'QCM DE DEMO', '2023-03-27 13:13:02', 1, 'BTS SN1', 'test@test', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2187, 'QCM DE DEMO', '2023-03-27 13:13:02', 1, 'BTS SN1', 'test@test', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2188, 'QCM DE DEMO', '2023-03-27 13:13:02', 1, 'BTS SN1', 'test@test', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2189, 'QCM DE DEMO', '2023-03-27 13:13:02', 1, 'BTS SN1', 'test@test', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2190, 'QCM DE DEMO', '2023-03-27 13:13:02', 1, 'BTS SN1', 'test@test', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2191, 'QCM DE DEMO', '2023-03-27 13:13:02', 1, 'BTS SN1', 'test@test', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2192, 'QCM DE DEMO', '2023-03-27 13:13:02', 1, 'BTS SN1', 'test@test', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2193, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'tri@tri', NULL, 1, 'La prise de la Bastille, en 1789', NULL, NULL, NULL, 1),
	(2194, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'art@art', NULL, 2, '1', NULL, NULL, NULL, 0),
	(2195, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'art@art', NULL, 3, 'Kali Linux', NULL, NULL, NULL, 1),
	(2196, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'art@art', NULL, 1, 'La prise de la Bastille, en 1789', NULL, NULL, NULL, 1),
	(2197, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'tri@tri', NULL, 2, '1', NULL, NULL, NULL, 0),
	(2198, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'art@art', NULL, 4, 'Un langage qui permet de faire des requêtes SQL sur une DB', NULL, NULL, NULL, 0),
	(2199, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'tri@tri', NULL, 3, 'Kali Linux', NULL, NULL, NULL, 1),
	(2200, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'art@art', NULL, 5, 'Georges Pompidou', NULL, NULL, NULL, 0),
	(2201, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'tri@tri', NULL, 4, 'Un langage qui permet de faire des requêtes SQL sur une DB', NULL, NULL, NULL, 0),
	(2202, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'art@art', NULL, 6, ' les Américains lancent une offensive en Afghanistan (lutte anti-terroriste)', NULL, NULL, NULL, 0),
	(2203, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'tri@tri', NULL, 5, 'Georges Pompidou', NULL, NULL, NULL, 0),
	(2204, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'tri@tri', NULL, 6, ' les Américains lancent une offensive en Afghanistan (lutte anti-terroriste)', NULL, NULL, NULL, 0),
	(2206, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'art@art', NULL, 8, 'Bataille de la somme', NULL, NULL, NULL, 0),
	(2208, 'QCM DE DEMO', '2023-03-27 16:40:35', 1, 'BTS SN1', 'tri@tri', NULL, 8, 'Bataille de la somme', NULL, NULL, NULL, 0),
	(2209, 'QCM DE DEMO', '2023-03-27 16:53:18', 1, 'BTS SN2', 'tt@t', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2210, 'QCM DE DEMO', '2023-03-27 16:53:18', 1, 'BTS SN2', 'tt@t', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2211, 'QCM DE DEMO', '2023-03-27 16:53:18', 1, 'BTS SN2', 'tt@t', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2212, 'QCM DE DEMO', '2023-03-27 16:53:18', 1, 'BTS SN2', 'tt@t', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2213, 'QCM DE DEMO', '2023-03-27 16:53:18', 1, 'BTS SN2', 'tt@t', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2214, 'QCM DE DEMO', '2023-03-27 16:53:18', 1, 'BTS SN2', 'tt@t', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2215, 'QCM DE DEMO', '2023-03-27 16:53:18', 1, 'BTS SN2', 'tt@t', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2216, 'QCM DE DEMO', '2023-03-27 16:53:18', 1, 'BTS SN2', 'tt@t', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2217, 'QCM DE DEMO', '2023-03-30 08:29:54', 1, 'BTS SN1', 'erg@erg', NULL, 1, NULL, NULL, NULL, NULL, 0),
	(2218, 'QCM DE DEMO', '2023-03-30 08:29:54', 1, 'BTS SN1', 'erg@erg', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2219, 'QCM DE DEMO', '2023-03-30 08:29:54', 1, 'BTS SN1', 'erg@erg', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2220, 'QCM DE DEMO', '2023-03-30 08:29:54', 1, 'BTS SN1', 'erg@erg', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2221, 'QCM DE DEMO', '2023-03-30 08:29:54', 1, 'BTS SN1', 'erg@erg', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2222, 'QCM DE DEMO', '2023-03-30 08:29:54', 1, 'BTS SN1', 'erg@erg', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2223, 'QCM DE DEMO', '2023-03-30 08:29:54', 1, 'BTS SN1', 'erg@erg', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2224, 'QCM DE DEMO', '2023-03-30 08:29:54', 1, 'BTS SN1', 'erg@erg', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2225, 'QCM DE DEMO', '2023-03-30 08:33:49', 1, 'BTS SN1', 'aa@aa', NULL, 1, 'L\'armistice de 1918', NULL, NULL, NULL, 0),
	(2226, 'QCM DE DEMO', '2023-03-30 08:33:49', 1, 'BTS SN1', 'aa@aa', NULL, 2, '1', NULL, NULL, NULL, 0),
	(2227, 'QCM DE DEMO', '2023-03-30 08:33:49', 1, 'BTS SN1', 'aa@aa', NULL, 3, 'MI6 : Secret Intelligence Service. Royaume-Unis', NULL, NULL, NULL, 0),
	(2228, 'QCM DE DEMO', '2023-03-30 08:33:49', 1, 'BTS SN1', 'aa@aa', NULL, 4, 'Un langage basé objet', NULL, NULL, NULL, 0),
	(2229, 'QCM DE DEMO', '2023-03-30 08:33:49', 1, 'BTS SN1', 'aa@aa', NULL, 5, 'Jacques Chirac ', NULL, NULL, NULL, 1),
	(2230, 'QCM DE DEMO', '2023-03-30 08:33:49', 1, 'BTS SN1', 'aa@aa', NULL, 7, 'Un bug concernant le World Wide Web', NULL, NULL, NULL, 0),
	(2231, 'QCM DE DEMO', '2023-03-30 08:33:49', 1, 'BTS SN1', 'aa@aa', NULL, 6, 'Les USA deviennent "les gendarmes du monde"', NULL, NULL, NULL, 0),
	(2232, 'QCM DE DEMO', '2023-03-30 08:33:49', 1, 'BTS SN1', 'aa@aa', NULL, 8, 'Bataille de Stalingrad', NULL, NULL, NULL, 0),
	(2233, 'QCM DE DEMO', '2023-04-03 11:07:06', 1, 'BTS SN1', 'zef@zef', NULL, 1, 'L\'armistice de 1918', NULL, NULL, NULL, 0),
	(2234, 'QCM DE DEMO', '2023-04-03 11:07:06', 1, 'BTS SN1', 'zef@zef', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2235, 'QCM DE DEMO', '2023-04-03 11:07:06', 1, 'BTS SN1', 'zef@zef', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2236, 'QCM DE DEMO', '2023-04-03 11:07:06', 1, 'BTS SN1', 'zef@zef', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2237, 'QCM DE DEMO', '2023-04-03 11:07:06', 1, 'BTS SN1', 'zef@zef', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2238, 'QCM DE DEMO', '2023-04-03 11:07:06', 1, 'BTS SN1', 'zef@zef', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2239, 'QCM DE DEMO', '2023-04-03 11:07:06', 1, 'BTS SN1', 'zef@zef', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2240, 'QCM DE DEMO', '2023-04-03 11:07:06', 1, 'BTS SN1', 'zef@zef', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2241, 'QCM DE DEMO', '2023-04-06 16:17:02', 1, 'BTS SN1', 'ji@u', NULL, 4, NULL, NULL, NULL, NULL, 0),
	(2242, 'QCM DE DEMO', '2023-04-06 16:17:02', 1, 'BTS SN1', 'ji@u', NULL, 3, NULL, NULL, NULL, NULL, 0),
	(2243, 'QCM DE DEMO', '2023-04-06 16:17:02', 1, 'BTS SN1', 'ji@u', NULL, 2, NULL, NULL, NULL, NULL, 0),
	(2244, 'QCM DE DEMO', '2023-04-06 16:17:02', 1, 'BTS SN1', 'ji@u', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2245, 'QCM DE DEMO', '2023-04-06 16:17:02', 1, 'BTS SN1', 'ji@u', NULL, 1, 'L\'armistice de 1918', NULL, NULL, NULL, 0),
	(2246, 'QCM DE DEMO', '2023-04-06 16:17:02', 1, 'BTS SN1', 'ji@u', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2247, 'QCM DE DEMO', '2023-04-06 16:17:02', 1, 'BTS SN1', 'ji@u', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2248, 'QCM DE DEMO', '2023-04-06 16:17:02', 1, 'BTS SN1', 'ji@u', NULL, 8, NULL, NULL, NULL, NULL, 0),
	(2249, 'QCM DE DEMO', '2023-04-06 16:19:14', 1, 'BTS SN1', 'a@a', NULL, 3, 'Opération tonnerre (James Bond, 1965)', NULL, NULL, NULL, 0),
	(2250, 'QCM DE DEMO', '2023-04-06 16:19:14', 1, 'BTS SN1', 'a@a', NULL, 5, NULL, NULL, NULL, NULL, 0),
	(2251, 'QCM DE DEMO', '2023-04-06 16:19:14', 1, 'BTS SN1', 'a@a', NULL, 2, '2', NULL, NULL, NULL, 0),
	(2252, 'QCM DE DEMO', '2023-04-06 16:19:14', 1, 'BTS SN1', 'a@a', NULL, 4, 'Un langage orienté objet', NULL, NULL, NULL, 0),
	(2253, 'QCM DE DEMO', '2023-04-06 16:19:14', 1, 'BTS SN1', 'a@a', NULL, 1, 'La prise de la Bastille, en 1789', NULL, NULL, NULL, 1),
	(2254, 'QCM DE DEMO', '2023-04-06 16:19:14', 1, 'BTS SN1', 'a@a', NULL, 6, NULL, NULL, NULL, NULL, 0),
	(2255, 'QCM DE DEMO', '2023-04-06 16:19:14', 1, 'BTS SN1', 'a@a', NULL, 7, NULL, NULL, NULL, NULL, 0),
	(2256, 'QCM DE DEMO', '2023-04-06 16:19:14', 1, 'BTS SN1', 'a@a', NULL, 8, NULL, NULL, NULL, NULL, 0);
/*!40000 ALTER TABLE `results` ENABLE KEYS */;

-- Listage de la structure de la table equizz. student group
CREATE TABLE IF NOT EXISTS `student group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.student group : ~2 rows (environ)
DELETE FROM `student group`;
/*!40000 ALTER TABLE `student group` DISABLE KEYS */;
INSERT INTO `student group` (`id`, `name`) VALUES
	(1, 'BTS SN1'),
	(2, 'BTS SN2');
/*!40000 ALTER TABLE `student group` ENABLE KEYS */;

-- Listage de la structure de la table equizz. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `mail` (`mail`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table equizz.user : ~2 rows (environ)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `mail`, `password`) VALUES
	(1, 'crahe.arthur@gmail.com', 'arthur'),
	(2, 'test.test@gmail.com', 'test'),
	(3, 'antoine@btssn.fr', 'antoine');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
