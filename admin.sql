-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 172.16.5.181    Database: etech_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `emp_name` varchar(255) NOT NULL,
  `emp_role` varchar(255) NOT NULL,
  `emp_jobtitle` varchar(255) DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_updated_by` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `emp_id` (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,1328,'Indemne, Darwin C.','superadmin','Programmer/ Dev','2025-08-15 00:57:23','2025-11-24 03:01:47','1328',NULL),(2,1678,'Asoy, Soel H.','admin','Equipment Engineering Section Head','2025-08-27 02:05:32','2025-11-24 02:45:27','1328',NULL),(4,319,'Adriano, Ryan R.','admin','Equipment Engineering Section Head','2025-08-27 04:00:21','2025-11-24 02:45:27','1328',NULL),(11,1283,'Cahigan, Arman S.','admin','Equipment Engineering Section Head','2025-10-20 06:33:06','2025-11-24 02:45:27','1328',NULL),(12,1707,'Constante, Vaneza S.','toolcrib','Equipment Technician 1','2025-10-28 23:53:47','2025-11-24 02:45:27','1328',NULL),(13,16103,'Sauquillo, Maria Lyka B.','toolcrib','Equipment Technician 1','2025-11-04 01:24:56','2025-11-24 02:45:27','1328',NULL),(14,1710,'Permejo, Ma. Joan L.','toolcrib','Equipment Technician 1','2025-11-04 01:25:10','2025-11-24 02:45:27','1328',NULL),(16,1409,'Bedia Jr., Wilmer P.','approver','Equipment Engineer','2025-11-14 17:26:49','2025-11-24 02:45:27','1678',NULL),(17,1789,'Miro, Frelyn Mae D.','approver','Equipment Engineer','2025-11-14 17:27:19','2025-11-24 02:45:27','1678',NULL),(18,1816,'Francisco, Jeremiah T.','approver','Equipment Engineer','2025-11-14 17:27:59','2025-11-24 02:45:27','1678',NULL),(19,1788,'Eugenio, Halley Joan B.','engineer','Sr. Equipment Engineer	','2025-11-18 05:26:18','2025-11-24 02:45:27','1328',NULL),(20,1173,'Abarquez, Alvin V.','seniortech','Equipment Technician 2','2025-11-18 05:27:14','2025-11-24 02:45:27','1328',NULL),(21,1102,'Marquez, Davey D.','seniortech','Equipment Engineering Supervisor / Equipment Specialist','2025-11-18 05:27:29','2025-11-24 02:45:27','1328',NULL),(22,710,'Loyola, Rhen-ren L.','seniortech','Equipment Engineering Supervisor / Equipment Specialist','2025-11-18 05:27:43','2025-11-24 02:45:27','1328',NULL),(23,550,'Jimenez, Eugene Oniel J.','seniortech','Senior Equipment Technician','2025-11-18 05:27:57','2025-11-24 02:45:27','1328',NULL),(24,1582,'Oro, Julius C.','seniortech','Senior Equipment Technician	','2025-11-18 05:28:09','2025-11-24 02:45:27','1328',NULL),(25,1650,'Delgado, Alexander M.','esd','ESD Technician 1','2025-11-18 05:34:42','2025-11-24 02:45:27','1328',NULL),(26,16412,'Guarin, Ronald Jr. B.','esd','DIC Clerk 1','2025-11-18 05:35:13','2025-11-24 02:45:27','1328',NULL),(29,1340,'Bernabe III, Magdaleno Dale V.','approver','Equipment Engineer','2025-11-19 00:28:56','2025-11-24 02:45:27','1678',NULL),(30,1003,'Bajado, Randy A.','approver','Equipment Engineer','2025-11-19 00:34:53','2025-11-24 02:45:27','1678',NULL),(31,1088,'Angue, Jerick G.','pmtech','Equipment Technician 2','2025-11-24 01:33:29','2025-11-24 02:45:27','1283',NULL),(32,1742,'Seniel, Rommel A.','pmtech','Equipment Technician 1','2025-11-24 01:46:47','2025-11-24 02:45:27','1283',NULL),(33,17807,'Lotino, Krizia R.','pmtech','Equipment Technician 1','2025-11-24 01:55:35','2025-11-24 02:45:27','1283',NULL),(34,1638,'Escauriaga, Bernard V.','pmtech','Equipment Technician 1','2025-11-24 02:02:27','2025-11-24 02:45:27','1283',NULL),(35,1747,'Labuni, Matthew Zion P.','pmtech','Equipment Technician 1','2025-11-24 02:20:23','2025-11-24 02:45:27','1283',NULL),(36,1745,'Coronel, Rod L.','pmtech','Equipment Technician 1','2025-11-24 02:46:42','2025-11-24 02:48:30','1283',NULL),(37,1736,'Banug, Merben M.','pmtech','Equipment Technician 1','2025-11-24 02:50:32','2025-11-24 02:50:32','1283',NULL),(38,1797,'Bajao, Joanna Nichole M.','pmtech','Equipment Technician 1','2025-11-24 02:51:37','2025-11-24 05:24:40','1283',NULL),(39,1844,'Reyes, Vam Kimberly M.','pmtech','Equipment Technician 1','2025-11-24 02:53:24','2025-11-24 02:53:24','1283',NULL),(40,1836,'Nierra, Josh Edward A.','pmtech','Equipment Technician 1','2025-11-24 02:53:41','2025-11-24 02:53:41','1283',NULL),(41,13944,'Diaz, Marwino R.','tooling','Equipment Technician 1','2025-11-24 02:57:16','2025-11-24 02:57:16','1283',NULL),(43,1771,'Clara, Jeferson B.','approver','Equipment Engineer','2025-11-24 03:25:33','2025-11-24 03:25:33','1283',NULL),(44,1739,'Dela Rama, Kristine R.','approver','Equipment Engineer','2025-11-24 03:25:41','2025-11-24 03:25:41','1283',NULL),(45,10956,'Egasan, Mark Dennis A.','esd','ESD Technician 2','2025-11-24 07:54:36','2025-11-24 07:54:36','1283',NULL),(46,1772,'Cordova, Norman A.','admin','Equipment Engineer Section Head','2025-11-27 16:28:21','2025-11-27 16:28:21','1678',NULL),(47,1825,'Arambulo, Emmanuel B.','pmtech','Equipment Technician 2','2025-12-11 09:28:35','2025-12-11 09:28:35','1742',NULL),(48,1847,'Aviñante, Mark F.','pmtech','Equipment Technician 2','2025-12-23 09:10:41','2025-12-23 09:10:41','1742',NULL),(49,1858,'Izon, Acemon I.','pmtech','Equipment Technician 2','2026-01-06 04:10:53','2026-01-06 04:10:53','1742',NULL);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-08  9:11:04
