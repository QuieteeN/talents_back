-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: talents_db
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `houseNumber` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `pos` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'','','Казань','','','49.106414 55.796127','2024-06-04 20:09:31','2024-06-04 20:09:31'),(2,'35','Кремлевская','Казань','Республика Татарстан','Россия','49.122135 55.792139','2024-06-04 20:10:07','2024-06-05 17:30:18'),(3,'4','Улица Славы','Сая','Республика Татарстан','Россия','49.172656 56.053361','2024-06-05 15:21:27','2024-06-05 15:21:27');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employerinfos`
--

DROP TABLE IF EXISTS `employerinfos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employerinfos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `employerId` int NOT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `companyDescription` text,
  `logoUrl` varchar(255) DEFAULT NULL,
  `addressId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employerId` (`employerId`),
  KEY `addressId` (`addressId`),
  CONSTRAINT `employerinfos_ibfk_1` FOREIGN KEY (`employerId`) REFERENCES `employers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employerinfos_ibfk_2` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employerinfos`
--

LOCK TABLES `employerinfos` WRITE;
/*!40000 ALTER TABLE `employerinfos` DISABLE KEYS */;
INSERT INTO `employerinfos` VALUES (1,NULL,7,'IBM','IBM - ИТ-Компания\nДостаточно большая','/images/employers/1717609346085-Amazon_logo.png',2,'2024-06-04 19:48:30','2024-06-05 17:42:26');
/*!40000 ALTER TABLE `employerinfos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employers`
--

DROP TABLE IF EXISTS `employers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employers`
--

LOCK TABLES `employers` WRITE;
/*!40000 ALTER TABLE `employers` DISABLE KEYS */;
INSERT INTO `employers` VALUES (7,'Ilnar','Sagiev','ilnar.sagiev@inbox.ru','$2a$10$CF9LFjq.mrwgJx8IqvWLB.GkitVHaWhLbCB6p/50u/DI2rgprVLEK','2024-06-04 19:48:30','2024-06-04 19:48:30');
/*!40000 ALTER TABLE `employers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employersocials`
--

DROP TABLE IF EXISTS `employersocials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employersocials` (
  `employerInfoId` int NOT NULL,
  `socialId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`employerInfoId`,`socialId`),
  UNIQUE KEY `EmployerSocials_socialId_employerInfoId_unique` (`employerInfoId`,`socialId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employersocials`
--

LOCK TABLES `employersocials` WRITE;
/*!40000 ALTER TABLE `employersocials` DISABLE KEYS */;
INSERT INTO `employersocials` VALUES (1,4,'2024-06-04 22:11:09','2024-06-04 22:11:09'),(1,5,'2024-06-04 22:11:09','2024-06-04 22:11:09'),(1,6,'2024-06-04 22:11:09','2024-06-04 22:11:09'),(1,7,'2024-06-04 22:11:09','2024-06-04 22:11:09'),(1,8,'2024-06-04 22:11:09','2024-06-04 22:11:09');
/*!40000 ALTER TABLE `employersocials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socials`
--

DROP TABLE IF EXISTS `socials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socials`
--

LOCK TABLES `socials` WRITE;
/*!40000 ALTER TABLE `socials` DISABLE KEYS */;
INSERT INTO `socials` VALUES (4,'https://www.ibm.com/about/russia/','official','2024-06-04 22:11:09','2024-06-04 22:11:09'),(6,'https://vk.com/ibm_lenovo','vk','2024-06-04 22:11:09','2024-06-04 22:11:09'),(7,'https://ok.ru/video/3312364883708','ok','2024-06-04 22:11:09','2024-06-04 22:11:09'),(8,'https://www.youtube.com/@IBM','youtube','2024-06-04 22:11:09','2024-06-04 22:11:09'),(9,'https://t.me/quieteen','telegram','2024-06-05 15:40:07','2024-06-05 15:40:07'),(10,'https://vk.com/quieteen','vk','2024-06-05 15:40:07','2024-06-05 15:40:07');
/*!40000 ALTER TABLE `socials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentinfos`
--

DROP TABLE IF EXISTS `studentinfos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentinfos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `photoUrl` varchar(255) DEFAULT NULL,
  `addressId` int DEFAULT NULL,
  `studentId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `addressId` (`addressId`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `studentinfos_ibfk_1` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `studentinfos_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentinfos`
--

LOCK TABLES `studentinfos` WRITE;
/*!40000 ALTER TABLE `studentinfos` DISABLE KEYS */;
INSERT INTO `studentinfos` VALUES (2,'+79656040903',NULL,3,12,'2024-06-05 11:22:27','2024-06-05 15:21:27');
/*!40000 ALTER TABLE `studentinfos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (12,'Ilnar','Sagiev','ilnar.sagiev@inbox.ru','$2a$10$VZhvcGVWtBG39b714kL6Yex906Z567nJNWsHB9bRfRnlSxg5yHYLm','2024-06-05 11:22:27','2024-06-05 16:21:23');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentsocials`
--

DROP TABLE IF EXISTS `studentsocials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentsocials` (
  `studentInfoId` int NOT NULL,
  `socialId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`studentInfoId`,`socialId`),
  UNIQUE KEY `StudentSocials_socialId_studentInfoId_unique` (`studentInfoId`,`socialId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentsocials`
--

LOCK TABLES `studentsocials` WRITE;
/*!40000 ALTER TABLE `studentsocials` DISABLE KEYS */;
INSERT INTO `studentsocials` VALUES (2,9,'2024-06-05 15:40:07','2024-06-05 15:40:07'),(2,10,'2024-06-05 15:40:07','2024-06-05 15:40:07');
/*!40000 ALTER TABLE `studentsocials` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-05 21:49:22
