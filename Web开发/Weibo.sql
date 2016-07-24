-- MySQL dump 10.13  Distrib 5.7.11, for osx10.9 (x86_64)
--
-- Host: localhost    Database: Weibo
-- ------------------------------------------------------
-- Server version	5.7.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `password` varchar(18) NOT NULL,
  `mainpage` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `sign` varchar(500) DEFAULT NULL,
  `focus` int(8) NOT NULL DEFAULT '0',
  `fan` int(8) NOT NULL DEFAULT '0',
  `weibo_num` int(10) NOT NULL DEFAULT '0',
  `birthday` varchar(10) NOT NULL,
  `img` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'weibo_test','123456','http://localhost:8011/weibo_test/','北京市 海淀区 北京交通大学','此生无悔入µ\'s，来世愿生幻想乡',20,10000,60000,'1996-06-28','/face/1028.jpg'),(2,'friend2','123456','http://localhost:8011/friend2/','香港','呵呵',20,20,20,'1979-11-24','/face/zxw.jpg'),(4,'123','123','http://127.0.0.1:8011/123/','123','123',0,0,0,'123','/upload/undefined_face_屏幕快照 2016-06-07 上午10.35.39.png');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_friend`
--

DROP TABLE IF EXISTS `user_friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_friend` (
  `user_id` int(10) NOT NULL,
  `friend_id` int(10) DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `friend_id` (`friend_id`),
  CONSTRAINT `user_friend_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_friend_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_friend`
--

LOCK TABLES `user_friend` WRITE;
/*!40000 ALTER TABLE `user_friend` DISABLE KEYS */;
INSERT INTO `user_friend` VALUES (1,2),(1,2);
/*!40000 ALTER TABLE `user_friend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_weibo`
--

DROP TABLE IF EXISTS `user_weibo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_weibo` (
  `user_id` int(10) NOT NULL,
  `weibo_id` int(10) NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `weibo_id` (`weibo_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `weibo_id` FOREIGN KEY (`weibo_id`) REFERENCES `weibo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_weibo`
--

LOCK TABLES `user_weibo` WRITE;
/*!40000 ALTER TABLE `user_weibo` DISABLE KEYS */;
INSERT INTO `user_weibo` VALUES (1,1),(1,3),(1,4),(1,5),(2,6);
/*!40000 ALTER TABLE `user_weibo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weibo`
--

DROP TABLE IF EXISTS `weibo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `weibo` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `passage` varchar(280) NOT NULL,
  `img` varchar(100) DEFAULT NULL,
  `date` varchar(10) NOT NULL DEFAULT '2016-06-17',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weibo`
--

LOCK TABLES `weibo` WRITE;
/*!40000 ALTER TABLE `weibo` DISABLE KEYS */;
INSERT INTO `weibo` VALUES (1,'：我的乖乖，玩大了啊。研发人员自编自导自演自谱自唱的电影，居然搞这么大动静,影片和网络累计播放上1000万次。这部电影全部制作花费才6万，仅相当于\n                        1个研发人员的两个月收入。钱，不是万能滴。','/face/7.jpg','2016-06-17'),(3,'Hello World!','/upload/1_屏幕快照 2016-06-07 上午10.35.39.png','2016-06-17'),(4,'Hello World!','/upload/1_屏幕快照 2016-06-13 下午9.25.23.png','2016-06-17'),(5,'Hello Shit!','/upload/1_DD83C233CF460658FA7A6DE62EF98A6A.gif','2016-06-17'),(6,'真的不公平啊','/upload/2_屏幕快照 2016-06-12 下午6.18.32.png','2016-06-17');
/*!40000 ALTER TABLE `weibo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-17  8:25:00
