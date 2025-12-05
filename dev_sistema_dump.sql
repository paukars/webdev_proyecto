-- MySQL dump 10.13  Distrib 9.4.0, for macos15 (arm64)
--
-- Host: localhost    Database: dev_sistema_escolar_db
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
INSERT INTO `auth_group` VALUES (1,'administrador'),(3,'alumno'),(2,'maestro');
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add Token',7,'add_token'),(26,'Can change Token',7,'change_token'),(27,'Can delete Token',7,'delete_token'),(28,'Can view Token',7,'view_token'),(29,'Can add Token',8,'add_tokenproxy'),(30,'Can change Token',8,'change_tokenproxy'),(31,'Can delete Token',8,'delete_tokenproxy'),(32,'Can view Token',8,'view_tokenproxy'),(33,'Can add administradores',9,'add_administradores'),(34,'Can change administradores',9,'change_administradores'),(35,'Can delete administradores',9,'delete_administradores'),(36,'Can view administradores',9,'view_administradores'),(37,'Can add alumnos',10,'add_alumnos'),(38,'Can change alumnos',10,'change_alumnos'),(39,'Can delete alumnos',10,'delete_alumnos'),(40,'Can view alumnos',10,'view_alumnos'),(41,'Can add maestros',11,'add_maestros'),(42,'Can change maestros',11,'change_maestros'),(43,'Can delete maestros',11,'delete_maestros'),(44,'Can view maestros',11,'view_maestros'),(45,'Can add Evento académico',12,'add_eventoacademico'),(46,'Can change Evento académico',12,'change_eventoacademico'),(47,'Can delete Evento académico',12,'delete_eventoacademico'),(48,'Can view Evento académico',12,'view_eventoacademico'),(49,'Can add Registro de evento',13,'add_eventoregistro'),(50,'Can change Registro de evento',13,'change_eventoregistro'),(51,'Can delete Registro de evento',13,'delete_eventoregistro'),(52,'Can view Registro de evento',13,'view_eventoregistro');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (2,'pbkdf2_sha256$720000$ql939J26ZL5wZ40YMHymqN$N86pMpj+gUtc+1/K65wcu7e8Rfycv7Mt9UkT5CI4JNI=',NULL,0,'maestro@test.com','María','García','maestro@test.com',0,1,'2025-11-21 01:08:15.174004'),(4,'pbkdf2_sha256$720000$bGkN7491buT2UbGgRo1Usl$dTnafkzvIiXCbVL6LYyJ0AyMI3fsZO+1S2pCww5gFxI=','2025-11-21 01:36:40.379124',1,'paukars','','','paul@gmail.com',1,1,'2025-11-21 01:17:52.217895'),(7,'pbkdf2_sha256$720000$6hsuQwyZItdIfyjs3Bu9L1$c6HMthqNIKbV2vWEsG3/vAJ7NFr9yU+pQEHuh46ReXo=',NULL,0,'admin1@escuela.edu.mx','Teresaaa','Pérez ','admin1@escuela.edu.mx',0,1,'2025-11-21 02:17:24.768839'),(9,'pbkdf2_sha256$720000$LXcvfFEuatAJF7Hxm6Bx0w$Szrm4KlR9gr+v6xw9Z7IAzEcaG3CMzNu0WZ13jZiutg=',NULL,0,'admin3@escuela.edu.mx','Carlos','Ruiz Ortiz','admin3@escuela.edu.mx',0,1,'2025-11-21 02:17:24.894952'),(10,'pbkdf2_sha256$720000$GlCTIsSO9ZL46BCUwg8e9g$Yf5tSwQnu4ByABPDvZGPFt2c7evqs0pHZNv9jY1vNqM=',NULL,0,'admin4@escuela.edu.mx','Elena','Pérez Hernández','admin4@escuela.edu.mx',0,1,'2025-11-21 02:17:24.956304'),(11,'pbkdf2_sha256$720000$1hW45F1U6GVmER9G8tPCGQ$RxBIW7yrkKzu++gTetv3Zl+Vrr/udKJMpuTktUNiaKg=',NULL,0,'admin5@escuela.edu.mx','Daniel','Jiménez Flores','admin5@escuela.edu.mx',0,1,'2025-11-21 02:17:25.017460'),(12,'pbkdf2_sha256$720000$nnfOVKz9xBStUPnq0Thxi2$0D5AHNvv6e2AzfHQYGjo0y6SobUiYfxxZaqvvRDaVVU=',NULL,0,'admin6@escuela.edu.mx','Alejandro','López Ruiz','admin6@escuela.edu.mx',0,1,'2025-11-21 02:17:25.077088'),(13,'pbkdf2_sha256$720000$uQHe57258LgSpwIIlVOxY9$IVHVl3hxHcnYAfjhtCiWYavEYgFQiXyiJcXsFXnqd6s=',NULL,0,'admin7@escuela.edu.mx','Paola','Reyes Vargas','admin7@escuela.edu.mx',0,1,'2025-11-21 02:17:25.137710'),(14,'pbkdf2_sha256$720000$lim7VFXOlHvMfGgMPE4GtK$QVR8t7cY0D+IJefaOuYHOocOS/hAtMkjtRpTV+jaVLI=',NULL,0,'admin8@escuela.edu.mx','Claudia','Cruz Vargas','admin8@escuela.edu.mx',0,1,'2025-11-21 02:17:25.197676'),(15,'pbkdf2_sha256$720000$LwHKXgbIyCAQPzt0GQFCDT$E+G5D1DcujtWzdpPa6HFTmSuGRQzTF6uLoWAAKOezPs=',NULL,0,'admin9@escuela.edu.mx','Patricia','Castillo Vargas','admin9@escuela.edu.mx',0,1,'2025-11-21 02:17:25.258554'),(17,'pbkdf2_sha256$720000$tjdqami1GgkvtVZCmOVjVN$Ce2u9NdZtEp84Wyc7lOirUnc6Y62QtKH/8jFos4CdX4=',NULL,0,'admin11@escuela.edu.mx','Carolina','Sánchez Álvarez','admin11@escuela.edu.mx',0,1,'2025-11-21 02:17:25.381587'),(18,'pbkdf2_sha256$720000$TVogMcFvk8F5V3LDusSyNu$Wo6xZUA9w0z+Z8agMiw4x3dz+Dq7tsdq3pNlQ2mKyzo=',NULL,0,'maestro1@escuela.edu.mx','Sandra','Ramírez Flores','maestro1@escuela.edu.mx',0,1,'2025-11-21 02:17:25.445326'),(19,'pbkdf2_sha256$720000$gXjkr7zt82MuWNtDukOlyP$gCfHBo53yoWvdd2KPsWC9I56LesKwq5VvzIYLXhqr3o=',NULL,0,'maestro2@escuela.edu.mx','Lucía','Rivera González','maestro2@escuela.edu.mx',0,1,'2025-11-21 02:17:25.505267'),(20,'pbkdf2_sha256$720000$tMZz4OCgZJ4b34E7TU06oe$3BXoyieb9pox3QnkUr31Y+VKS74NEyeyk1vSIK0mKvw=',NULL,0,'maestro3@escuela.edu.mx','Sandra','Martínez Martínez','maestro3@escuela.edu.mx',0,1,'2025-11-21 02:17:25.564073'),(21,'pbkdf2_sha256$720000$g10fWH8d9QA95dK7gOporv$40PAR7nPGiK+Lws273yEgpoALcJOm++sFQGMg6dYjeI=',NULL,0,'maestro4@escuela.edu.mx','Rosa','Ortiz Jiménez','maestro4@escuela.edu.mx',0,1,'2025-11-21 02:17:25.625387'),(22,'pbkdf2_sha256$720000$FmQw2kihP2NQ9c3GwmUqdQ$ffX8nPD54zVLQa2jRMooIxI/CVhRDxu+E/ETSrtYOhU=',NULL,0,'maestro5@escuela.edu.mx','José','Torres García','maestro5@escuela.edu.mx',0,1,'2025-11-21 02:17:25.684479'),(23,'pbkdf2_sha256$720000$4C4sIQ4pucB0CbT1ONLzcJ$OfDL7xAoQH68H8kTWQ1pCUo2EhLmO/PhTAse0O8QMRc=',NULL,0,'maestro6@escuela.edu.mx','Valentina','Rivera Vargas','maestro6@escuela.edu.mx',0,1,'2025-11-21 02:17:25.744188'),(24,'pbkdf2_sha256$720000$0BJAkR5Oqm993uJZQu6oTo$MUloI15GwVrm2iTWmTXl7Wopo1Is5Iz6OVBfPtXyMek=',NULL,0,'maestro7@escuela.edu.mx','Alberto','Romero Morales','maestro7@escuela.edu.mx',0,1,'2025-11-21 02:17:25.803183'),(25,'pbkdf2_sha256$720000$Fs0TkXld15lMB7dCOhPKWw$4NxYxP55v7cv/C+FLAfXc8o9arYWVDzphKXxjtvW4To=',NULL,0,'maestro8@escuela.edu.mx','Francisco','Ramírez García','maestro8@escuela.edu.mx',0,1,'2025-11-21 02:17:25.862396'),(26,'pbkdf2_sha256$720000$kZAdMk2WsNBPRhpq60KKaz$v6aUA3RqjXB1g8V8p1kI2yPgWt0bx6mw5QvMf3DAf/k=',NULL,0,'maestro9@escuela.edu.mx','Pablo','Hernández Sánchez','maestro9@escuela.edu.mx',0,1,'2025-11-21 02:17:25.922085'),(27,'pbkdf2_sha256$720000$98aS1pLZrWHqqEyWMGIZFA$P5UGEgTdvX6eu5Fpxfu/qX9+suHxbTV4d/jV0rGa0W4=',NULL,0,'maestro10@escuela.edu.mx','Miguel','Díaz Castillo','maestro10@escuela.edu.mx',0,1,'2025-11-21 02:17:25.981347'),(28,'pbkdf2_sha256$720000$O0fw7TgAawFSQYdPAvFVIC$TDiixM8/w7haH0wJM14CHKuMcR1yznNWW7gYsLuqX4s=',NULL,0,'maestro11@escuela.edu.mx','Roberto','Flores Ruiz','maestro11@escuela.edu.mx',0,1,'2025-11-21 02:17:26.040811'),(29,'pbkdf2_sha256$720000$SdBiwj0X4xGYGDjX3tosSL$6hzV6sL9bn1UOeQOEzK6goUh07vJJQu9cbE0wimr6zQ=',NULL,0,'maestro12@escuela.edu.mx','José','Ruiz Sánchez','maestro12@escuela.edu.mx',0,1,'2025-11-21 02:17:26.100248'),(30,'pbkdf2_sha256$720000$o8jDVglaHJvKWnfRJGyzDa$DthZstk/gth0NL8f4gjDqD2CMioc3lA9lfcwkJaEskg=',NULL,0,'maestro13@escuela.edu.mx','Antonio','Torres Cruz','maestro13@escuela.edu.mx',0,1,'2025-11-21 02:17:26.159546'),(31,'pbkdf2_sha256$720000$4k1REQdtYaDOsFXOYZSqet$hcPS6wM7iNybfbPPa63/eTUvcpiTAERm7seedMPc3oQ=',NULL,0,'maestro14@escuela.edu.mx','Isabel','Ruiz Flores','maestro14@escuela.edu.mx',0,1,'2025-11-21 02:17:26.218923'),(32,'pbkdf2_sha256$720000$p2PuzJjXqoERkcHSI81fe0$oLPFD9qYnqTNpuez3SygpHOqF0o4DCML8H7ZW4XbvcE=',NULL,0,'maestro15@escuela.edu.mx','Valentina','Ramírez Jiménez','maestro15@escuela.edu.mx',0,1,'2025-11-21 02:17:26.278177'),(36,'pbkdf2_sha256$720000$eqRk5jm43zlBogjwolNTFh$5EDzWiqAcYr57CD8e6OAuqfsqV+h0EYV7DRMznpAH+M=',NULL,0,'alumno4@escuela.edu.mx','Laura','Hernández Flores','alumno4@escuela.edu.mx',0,1,'2025-11-21 02:17:26.516600'),(37,'pbkdf2_sha256$720000$Hgphm4SwtFT6J4lHsj3VxA$/O0bVU1p3KF7/y/izT4suEYoEyamUwBeITuuqa7i/68=',NULL,0,'alumno5@escuela.edu.mx','Raúl','Castillo Mendoza','alumno5@escuela.edu.mx',0,1,'2025-11-21 02:17:26.575910'),(38,'pbkdf2_sha256$720000$v4gxGSx8Fh45LQyZGy7cxC$aiaQ7CKerGcR9a7+1fbHqu8gmkpRKtGwjwQN2j8oc8s=',NULL,0,'alumno6@escuela.edu.mx','Javier','Ortiz Rivera','alumno6@escuela.edu.mx',0,1,'2025-11-21 02:17:26.634962'),(39,'pbkdf2_sha256$720000$NZ9Co27UyLdt5GOlRQKaaF$LYQ9b5fP6aHLvXlmCSCFhpQQEA8VB5jVcwTC1Rkd3ic=',NULL,0,'alumno7@escuela.edu.mx','Fernando','Jiménez Rivera','alumno7@escuela.edu.mx',0,1,'2025-11-21 02:17:26.694344'),(40,'pbkdf2_sha256$720000$IBhDHUoQ4uckycvLwYHbMa$GfobNT/uLE2NgcTI9us3WEUNNIsF3WIqa3WT6zIs3bc=',NULL,0,'alumno8@escuela.edu.mx','Miguel','Sánchez González','alumno8@escuela.edu.mx',0,1,'2025-11-21 02:17:26.753745'),(41,'pbkdf2_sha256$720000$rudLeXs8Uhxv6Q8AwkI7LY$hjwNhafUGHE7DUkMnkWkrMblbniACYMcu5lDRVKg74w=',NULL,0,'alumno9@escuela.edu.mx','Andrea','Ramírez Castillo','alumno9@escuela.edu.mx',0,1,'2025-11-21 02:17:26.812826'),(42,'pbkdf2_sha256$720000$9PMDtOmZlFqa6OiAf3LTNW$DLMOJ19dUKARLW8VQkL2pURgb1nLOaepaRG2bdEvGt4=',NULL,0,'alumno10@escuela.edu.mx','Alberto','Jiménez Cruz','alumno10@escuela.edu.mx',0,1,'2025-11-21 02:17:26.871526'),(43,'pbkdf2_sha256$720000$7ulWss3cN2fot7aptVjhdN$3v7T3AjCrpx5XgkSkFyakxRQ3Y1D2MFk+bnKfeO47DM=',NULL,0,'alumno11@escuela.edu.mx','Pablo','Pérez Sánchez','alumno11@escuela.edu.mx',0,1,'2025-11-21 02:17:26.930626'),(44,'pbkdf2_sha256$720000$rZma578svEz6NKtm4fApWe$6uGsQjhJL5mOSm5o7bUgrww8dbDbZuSq35T9rfbhABo=',NULL,0,'alumno12@escuela.edu.mx','Fernando','Jiménez Cruz','alumno12@escuela.edu.mx',0,1,'2025-11-21 02:17:26.990545'),(45,'pbkdf2_sha256$720000$BE5805FIJb87xRRJhqFioi$J33z2xMol+Lh/anWgs30vE9mvYtYFhbX91yANypwY3Q=',NULL,0,'alumno13@escuela.edu.mx','Manuel','Gómez Torres','alumno13@escuela.edu.mx',0,1,'2025-11-21 02:17:27.049575'),(46,'pbkdf2_sha256$720000$m9ZGgfL3CzskTD6puA81Tn$t2HTGhlAsQ0pIVM6SmdMbRQje5qQKrmy6NY4VW6J6as=',NULL,0,'alumno14@escuela.edu.mx','Rodrigo','Reyes Reyes','alumno14@escuela.edu.mx',0,1,'2025-11-21 02:17:27.108894'),(47,'pbkdf2_sha256$720000$pIlR5pRT8AleSjUcDEzmiO$lq5iCLsP6114HLubeol9EkgyfaVuV1tl1hXIj/fwTLw=',NULL,0,'alumno15@escuela.edu.mx','Manuel','Jiménez Ramírez','alumno15@escuela.edu.mx',0,1,'2025-11-21 02:17:27.167920'),(48,'pbkdf2_sha256$720000$ZMjHMsl1Osq2RlA4TENE6W$/a62ZeR/OmWbI6jm1pUxd3K/Fp5PoMclYoJr2uUEceE=',NULL,0,'alumno16@escuela.edu.mx','Alejandro','Ortiz Silva','alumno16@escuela.edu.mx',0,1,'2025-11-21 02:17:27.227025'),(49,'pbkdf2_sha256$720000$UT0Z0UrJ6VKT0kWQ3ZuqdL$kQn/1SvNuMynbWnrhn0ipLfaRaew63o6+rWMRzrAQ7Q=',NULL,0,'alumno17@escuela.edu.mx','Paola','Cruz Gómez','alumno17@escuela.edu.mx',0,1,'2025-11-21 02:17:27.285648'),(50,'pbkdf2_sha256$720000$ln44V3pOyuPwNkevwzWp8Q$w4LBNWr2HIqq79Nfwo8pYTZfIGbk6oJIqPivT059lhs=',NULL,0,'alumno18@escuela.edu.mx','Julia','Gómez Díaz','alumno18@escuela.edu.mx',0,1,'2025-11-21 02:17:27.344926'),(51,'pbkdf2_sha256$720000$V1Mskc3qcziUkhtiuDXUUF$NB7rmXTQq/tVCldp79X2JxQMk23866R45t4EqbH/6tk=',NULL,0,'alumno19@escuela.edu.mx','Antonio','Flores Jiménez','alumno19@escuela.edu.mx',0,1,'2025-11-21 02:17:27.403883'),(52,'pbkdf2_sha256$720000$UBPYjL90WFuHiKiAkROOjR$kK1a8rC02Tdnjw4+EY/IS7X8lZWjeR22KFjayQYdDjw=',NULL,0,'alumno20@escuela.edu.mx','Sofía','Díaz Mendoza','alumno20@escuela.edu.mx',0,1,'2025-11-21 02:17:27.463304'),(53,'pbkdf2_sha256$720000$dH1AL5pyAjuPKqhauACdMf$kQxS568R33XYicDOpFJTZPsZfz8kDwzqlC9cWDML3yI=',NULL,0,'alumno21@escuela.edu.mx','Alejandro','Ramírez Torres','alumno21@escuela.edu.mx',0,1,'2025-11-21 02:17:27.522869'),(54,'pbkdf2_sha256$720000$407Op4ytNj1azPTJLGJAjM$7gPHClCo9GJ0hAQKI2t2qND+bJOyzwJh6i/vCbax36Y=',NULL,0,'alumno22@escuela.edu.mx','Martha','Gómez Pérez','alumno22@escuela.edu.mx',0,1,'2025-11-21 02:17:27.582343'),(55,'pbkdf2_sha256$720000$iRjsnxg4mqx3vKFmhL7R9W$iyM80IN7n9n7ihfL8EipMzu9oRy18QaYA7HMQnZL4+w=',NULL,0,'alumno23@escuela.edu.mx','Juan','Morales Torres','alumno23@escuela.edu.mx',0,1,'2025-11-21 02:17:27.641377'),(57,'pbkdf2_sha256$720000$0kD2b6TKBo1EPPpcrsWkrN$TdIxHC2BHHglx0UKZzp2veNgETJrspXNrNXswj/g4Mk=',NULL,0,'alumno25@escuela.edu.mx','Rodrigo','Reyes Ramírez','alumno25@escuela.edu.mx',0,1,'2025-11-21 02:17:27.762058');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
INSERT INTO `auth_user_groups` VALUES (2,2,2),(5,7,1),(7,9,1),(8,10,1),(9,11,1),(10,12,1),(11,13,1),(12,14,1),(13,15,1),(15,17,1),(16,18,2),(17,19,2),(18,20,2),(19,21,2),(20,22,2),(21,23,2),(22,24,2),(23,25,2),(24,26,2),(25,27,2),(26,28,2),(27,29,2),(28,30,2),(29,31,2),(30,32,2),(34,36,3),(35,37,3),(36,38,3),(37,39,3),(38,40,3),(39,41,3),(40,42,3),(41,43,3),(42,44,3),(43,45,3),(44,46,3),(45,47,3),(46,48,3),(47,49,3),(48,50,3),(49,51,3),(50,52,3),(51,53,3),(52,54,3),(53,55,3),(55,57,3);
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('6790f953fb6c1aa05a702503919549f4b89f0d58','2025-12-05 07:09:05.602572',7);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dev_sistema_escolar_api_administradores`
--

DROP TABLE IF EXISTS `dev_sistema_escolar_api_administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dev_sistema_escolar_api_administradores` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clave_admin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rfc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `ocupacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creation` datetime(6) DEFAULT NULL,
  `update` datetime(6) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dev_sistema_escolar__user_id_30aaaad6_fk_auth_user` (`user_id`),
  CONSTRAINT `dev_sistema_escolar__user_id_30aaaad6_fk_auth_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dev_sistema_escolar_api_administradores`
--

LOCK TABLES `dev_sistema_escolar_api_administradores` WRITE;
/*!40000 ALTER TABLE `dev_sistema_escolar_api_administradores` DISABLE KEYS */;
INSERT INTO `dev_sistema_escolar_api_administradores` VALUES (2,'ADM001','(222) 111-1111','PEPJ900101ABC',35,'Director General','2025-11-21 02:17:24.835276',NULL,7),(4,'ADM003','(222) 323-7390','RUIZCA7212041U8',53,'Coordinador de Servicios Escolares','2025-11-21 02:17:24.956051',NULL,9),(5,'ADM004','(222) 780-8163','PÉREEL65120670C',60,'Coordinador de Servicios Escolares','2025-11-21 02:17:25.017218',NULL,10),(6,'ADM005','(222) 602-8374','JIMÉDA861201IHF',39,'Coordinador de Servicios Escolares','2025-11-21 02:17:25.076911',NULL,11),(7,'ADM006','(222) 239-2299','LÓPEAL761203NEQ',49,'Jefe de Departamento','2025-11-21 02:17:25.137444',NULL,12),(8,'ADM007','(222) 802-6470','REYEPA841201W2C',41,'Coordinador de Servicios Escolares','2025-11-21 02:17:25.197425',NULL,13),(9,'ADM008','(222) 670-6915','CRUZCL691205SBS',56,'Director','2025-11-21 02:17:25.258304',NULL,14),(10,'ADM009','(222) 431-9013','CASTPA8312025S5',42,'Subdirector Académico','2025-11-21 02:17:25.320262',NULL,15),(12,'ADM011','(222) 304-6128','SÁNCCA691205MKQ',56,'Coordinador de Servicios Escolares','2025-11-21 02:17:25.441829',NULL,17);
/*!40000 ALTER TABLE `dev_sistema_escolar_api_administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dev_sistema_escolar_api_alumnos`
--

DROP TABLE IF EXISTS `dev_sistema_escolar_api_alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dev_sistema_escolar_api_alumnos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `matricula` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `curp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rfc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` datetime(6) DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ocupacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creation` datetime(6) DEFAULT NULL,
  `update` datetime(6) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dev_sistema_escolar_api_alumnos_user_id_34332068_fk_auth_user_id` (`user_id`),
  CONSTRAINT `dev_sistema_escolar_api_alumnos_user_id_34332068_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dev_sistema_escolar_api_alumnos`
--

LOCK TABLES `dev_sistema_escolar_api_alumnos` WRITE;
/*!40000 ALTER TABLE `dev_sistema_escolar_api_alumnos` DISABLE KEYS */;
INSERT INTO `dev_sistema_escolar_api_alumnos` VALUES (5,'202153104','HERNLA031127HPLZ9IAV','HERNLA031127CVE','2003-11-27 00:00:00.000000',22,'(222) 119-6626','Estudiante','2025-11-21 02:17:26.575666',NULL,36),(6,'202142675','CASTRA071126MPLRGWCL','CASTRA0711267JH','2007-11-26 00:00:00.000000',18,'(222) 974-8380','Estudiante','2025-11-21 02:17:26.634780',NULL,37),(7,'202520453','ORTIJA051126MPLK2PVY','ORTIJA0511260Q4','2005-11-26 00:00:00.000000',20,'(222) 172-8793','Estudiante','2025-11-21 02:17:26.694080',NULL,38),(8,'202468396','JIMÉFE991128MPLSMRXZ','JIMÉFE991128GN4','1999-11-28 00:00:00.000000',26,'(222) 342-9681','Estudiante','2025-11-21 02:17:26.753475',NULL,39),(9,'202440256','SÁNCMI011127HPL5HXXT','SÁNCMI011127PEW','2001-11-27 00:00:00.000000',24,'(222) 390-3925','Estudiante','2025-11-21 02:17:26.812561',NULL,40),(10,'202185727','RAMÍAN001127MPLKCFZD','RAMÍAN0011276ZN','2000-11-27 00:00:00.000000',25,'(222) 490-9654','Estudiante','2025-11-21 02:17:26.871281',NULL,41),(11,'202289885','JIMÉAL051126HPLFP763','JIMÉAL0511260ZZ','2005-11-26 00:00:00.000000',20,'(222) 632-5295','Estudiante','2025-11-21 02:17:26.930378',NULL,42),(12,'202292680','PÉREPA011127MPLD4EV1','PÉREPA011127013','2001-11-27 00:00:00.000000',24,'(222) 351-9276','Estudiante','2025-11-21 02:17:26.990282',NULL,43),(13,'202439338','JIMÉFE061126HPL9B7K7','JIMÉFE061126XS0','2006-11-26 00:00:00.000000',19,'(222) 460-5686','Estudiante','2025-11-21 02:17:27.049294',NULL,44),(14,'202146137','GÓMEMA071126MPL6LQSE','GÓMEMA071126CKU','2007-11-26 00:00:00.000000',18,'(222) 534-4892','Estudiante','2025-11-21 02:17:27.108641',NULL,45),(15,'202247341','REYERO971128MPL3H35U','REYERO9711287YU','1997-11-28 00:00:00.000000',28,'(222) 852-5003','Estudiante','2025-11-21 02:17:27.167653',NULL,46),(16,'202320910','JIMÉMA071126MPLXGWPL','JIMÉMA071126EQF','2007-11-26 00:00:00.000000',18,'(222) 993-2266','Estudiante','2025-11-21 02:17:27.226740',NULL,47),(17,'202350550','ORTIAL051126HPLDIPA4','ORTIAL051126510','2005-11-26 00:00:00.000000',20,'(222) 160-3377','Estudiante','2025-11-21 02:17:27.285384',NULL,48),(18,'202396023','CRUZPA021127HPLBDYKB','CRUZPA021127O7C','2002-11-27 00:00:00.000000',23,'(222) 469-7648','Estudiante','2025-11-21 02:17:27.344679',NULL,49),(19,'202188196','GÓMEJU981128HPL0IFAD','GÓMEJU981128GI2','1998-11-28 00:00:00.000000',27,'(222) 560-6431','Estudiante','2025-11-21 02:17:27.403615',NULL,50),(20,'202228752','FLORAN971128MPLIICJS','FLORAN971128VRM','1997-11-28 00:00:00.000000',28,'(222) 822-2236','Estudiante','2025-11-21 02:17:27.463063',NULL,51),(21,'202519998','DÍAZSO971128MPL3FSAD','DÍAZSO97112844Y','1997-11-28 00:00:00.000000',28,'(222) 906-2854','Estudiante','2025-11-21 02:17:27.522616',NULL,52),(22,'202393956','RAMÍAL041126MPLBSPWB','RAMÍAL0411265P3','2004-11-26 00:00:00.000000',21,'(222) 188-2808','Estudiante','2025-11-21 02:17:27.582095',NULL,53),(23,'202238930','GÓMEMA021127HPLD0VI3','GÓMEMA021127PY9','2002-11-27 00:00:00.000000',23,'(222) 807-2399','Estudiante','2025-11-21 02:17:27.641090',NULL,54),(24,'202149724','MORAJU061126MPLFHNIL','MORAJU061126BTI','2006-11-26 00:00:00.000000',19,'(222) 455-3615','Estudiante','2025-11-21 02:17:27.701861',NULL,55),(26,'202561612','REYERO051126HPLSMNVY','REYERO0511260EV','2005-11-26 00:00:00.000000',20,'(222) 257-4069','Estudiante','2025-11-21 02:17:27.822617',NULL,57);
/*!40000 ALTER TABLE `dev_sistema_escolar_api_alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dev_sistema_escolar_api_eventoacademico`
--

DROP TABLE IF EXISTS `dev_sistema_escolar_api_eventoacademico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dev_sistema_escolar_api_eventoacademico` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci,
  `sede` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `publico_objetivo` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `programa_educativo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_evento` date NOT NULL,
  `hora_inicio` time(6) NOT NULL,
  `hora_fin` time(6) NOT NULL,
  `cupo_maximo` int unsigned NOT NULL,
  `modalidad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creation` datetime(6) DEFAULT NULL,
  `update` datetime(6) DEFAULT NULL,
  `creado_por_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dev_sistema_escolar__creado_por_id_15767839_fk_auth_user` (`creado_por_id`),
  CONSTRAINT `dev_sistema_escolar__creado_por_id_15767839_fk_auth_user` FOREIGN KEY (`creado_por_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `dev_sistema_escolar_api_eventoacademico_chk_1` CHECK ((`cupo_maximo` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dev_sistema_escolar_api_eventoacademico`
--

LOCK TABLES `dev_sistema_escolar_api_eventoacademico` WRITE;
/*!40000 ALTER TABLE `dev_sistema_escolar_api_eventoacademico` DISABLE KEYS */;
INSERT INTO `dev_sistema_escolar_api_eventoacademico` VALUES (1,'Fepro 2','Feria de Proyectos','Albert Einsten','publico_general','Educación Continua','2025-12-08','09:00:00.000000','10:00:00.000000',20,'presencial','2025-12-05 06:18:55.914181','2025-12-05 06:52:28.912213',7),(2,'Congreso de ciencia','Congreso cientific','Auditorio','alumnos','Ingeniería en Ciencias de la Computación','2025-12-09','09:00:00.000000','10:00:00.000000',20,'presencial','2025-12-05 06:22:21.248945','2025-12-05 06:22:21.248979',7),(3,'Evento test','Test','Test','alumnos','Ingeniería en Ciencias de la Computación','2025-12-12','09:00:00.000000','10:00:00.000000',20,'presencial','2025-12-05 06:29:01.516911','2025-12-05 06:29:01.516941',7);
/*!40000 ALTER TABLE `dev_sistema_escolar_api_eventoacademico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dev_sistema_escolar_api_eventoregistro`
--

DROP TABLE IF EXISTS `dev_sistema_escolar_api_eventoregistro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dev_sistema_escolar_api_eventoregistro` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `confirmado` tinyint(1) NOT NULL,
  `confirmado_en` datetime(6) DEFAULT NULL,
  `creation` datetime(6) DEFAULT NULL,
  `update` datetime(6) DEFAULT NULL,
  `evento_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dev_sistema_escolar_api__evento_id_user_id_c8796505_uniq` (`evento_id`,`user_id`),
  KEY `dev_sistema_escolar__user_id_5b7029e0_fk_auth_user` (`user_id`),
  CONSTRAINT `dev_sistema_escolar__evento_id_86ab404c_fk_dev_siste` FOREIGN KEY (`evento_id`) REFERENCES `dev_sistema_escolar_api_eventoacademico` (`id`),
  CONSTRAINT `dev_sistema_escolar__user_id_5b7029e0_fk_auth_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dev_sistema_escolar_api_eventoregistro`
--

LOCK TABLES `dev_sistema_escolar_api_eventoregistro` WRITE;
/*!40000 ALTER TABLE `dev_sistema_escolar_api_eventoregistro` DISABLE KEYS */;
/*!40000 ALTER TABLE `dev_sistema_escolar_api_eventoregistro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dev_sistema_escolar_api_maestros`
--

DROP TABLE IF EXISTS `dev_sistema_escolar_api_maestros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dev_sistema_escolar_api_maestros` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_trabajador` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` datetime(6) DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rfc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cubiculo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `area_investigacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `materias_json` longtext COLLATE utf8mb4_unicode_ci,
  `creation` datetime(6) DEFAULT NULL,
  `update` datetime(6) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dev_sistema_escolar__user_id_e3c0addd_fk_auth_user` (`user_id`),
  CONSTRAINT `dev_sistema_escolar__user_id_e3c0addd_fk_auth_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dev_sistema_escolar_api_maestros`
--

LOCK TABLES `dev_sistema_escolar_api_maestros` WRITE;
/*!40000 ALTER TABLE `dev_sistema_escolar_api_maestros` DISABLE KEYS */;
INSERT INTO `dev_sistema_escolar_api_maestros` VALUES (2,'MAE001','1963-12-07 00:00:00.000000','(222) 867-9514','RAMÍSA631207','B-205',NULL,'Ciberseguridad','[\"Inteligencia Artificial\", \"Programaci\\u00f3n II\", \"Seguridad Inform\\u00e1tica\", \"Estructuras de datos\", \"Aplicaciones Web\"]','2025-11-21 02:17:25.504803',NULL,18),(3,'MAE002','1966-12-06 00:00:00.000000','(222) 581-3478','RIVELU6612060QW','A-102',NULL,'Desarrollo Móvil','[\"Programaci\\u00f3n II\", \"Estructuras de Datos\", \"Desarrollo M\\u00f3vil\"]','2025-11-21 02:17:25.563803',NULL,19),(4,'MAE003','1987-12-01 00:00:00.000000','(222) 594-3613','MARTSA871201TLV','A-102',NULL,'Machine Learning','[\"Seguridad Inform\\u00e1tica\", \"Programaci\\u00f3n II\"]','2025-11-21 02:17:25.623179',NULL,20),(5,'MAE004','1970-12-05 00:00:00.000000','(222) 824-6994','ORTIRO701205WDH','B-203',NULL,'Bases de Datos','[\"Programaci\\u00f3n I\", \"Ingenier\\u00eda de Software\"]','2025-11-21 02:17:25.684207',NULL,21),(6,'MAE005','1973-12-04 00:00:00.000000','(222) 251-7885','TORRJO73120442P','B-205',NULL,'Redes de Computadoras','[\"Redes I\", \"Desarrollo M\\u00f3vil\"]','2025-11-21 02:17:25.743921',NULL,22),(7,'MAE006','1961-12-07 00:00:00.000000','(222) 327-9063','RIVEVA611207EPS','C-301',NULL,'Análisis de Datos','[\"Programaci\\u00f3n II\", \"Programaci\\u00f3n I\", \"Miner\\u00eda de Datos\"]','2025-11-21 02:17:25.802915',NULL,23),(8,'MAE007','1990-11-30 00:00:00.000000','(222) 207-3790','ROMEAL901130MXJ','B-201',NULL,'Inteligencia Artificial','[\"Programaci\\u00f3n II\", \"Desarrollo M\\u00f3vil\", \"Seguridad Inform\\u00e1tica\", \"Algoritmos\"]','2025-11-21 02:17:25.862118',NULL,24),(9,'MAE008','1983-12-02 00:00:00.000000','(222) 705-1602','RAMÍFR831202TWF','C-301',NULL,'Inteligencia Artificial','[\"Bases de Datos II\", \"Inteligencia Artificial\", \"Programaci\\u00f3n II\"]','2025-11-21 02:17:25.921820',NULL,25),(10,'MAE009','1966-12-06 00:00:00.000000','(222) 999-3709','HERNPA661206O3O','B-205',NULL,'Desarrollo Web','[\"Desarrollo M\\u00f3vil\", \"Aplicaciones Web\"]','2025-11-21 02:17:25.981081',NULL,26),(11,'MAE010','1995-11-29 00:00:00.000000','(222) 560-8187','DÍAZMI951129CIY','B-202',NULL,'Redes de Computadoras','[\"Sistemas Operativos\", \"Inteligencia Artificial\", \"Miner\\u00eda de Datos\", \"Seguridad Inform\\u00e1tica\"]','2025-11-21 02:17:26.040533',NULL,27),(12,'MAE011','1987-12-01 00:00:00.000000','(222) 622-2012','FLORRO871201R3E','C-304',NULL,'Desarrollo Móvil','[\"Programaci\\u00f3n II\", \"Programaci\\u00f3n I\", \"Bases de Datos II\"]','2025-11-21 02:17:26.099978',NULL,28),(13,'MAE012','1963-12-07 00:00:00.000000','(222) 376-2289','RUIZJO631207WI5','C-305',NULL,'Redes de Computadoras','[\"Sistemas Operativos\", \"Miner\\u00eda de Datos\"]','2025-11-21 02:17:26.159284',NULL,29),(14,'MAE013','1963-12-07 00:00:00.000000','(222) 995-4302','TORRAN631207QJR','B-203',NULL,'Desarrollo Web','[\"Aplicaciones Web\", \"Estructuras de Datos\", \"Programaci\\u00f3n I\"]','2025-11-21 02:17:26.218650',NULL,30),(15,'MAE014','1973-12-04 00:00:00.000000','(222) 239-9360','RUIZIS731204OAG','A-104',NULL,'Machine Learning','[\"Inteligencia Artificial\", \"Miner\\u00eda de Datos\", \"Redes II\"]','2025-11-21 02:17:26.277868',NULL,31),(16,'MAE015','1969-12-05 00:00:00.000000','(222) 524-1389','RAMÍVA691205AST','B-205',NULL,'Redes de Computadoras','[\"Ingenier\\u00eda de Software\", \"Redes I\", \"Seguridad Inform\\u00e1tica\"]','2025-11-21 02:17:26.336521',NULL,32);
/*!40000 ALTER TABLE `dev_sistema_escolar_api_maestros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(7,'authtoken','token'),(8,'authtoken','tokenproxy'),(5,'contenttypes','contenttype'),(9,'dev_sistema_escolar_api','administradores'),(10,'dev_sistema_escolar_api','alumnos'),(12,'dev_sistema_escolar_api','eventoacademico'),(13,'dev_sistema_escolar_api','eventoregistro'),(11,'dev_sistema_escolar_api','maestros'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-11-21 01:07:25.908243'),(2,'auth','0001_initial','2025-11-21 01:07:25.962377'),(3,'admin','0001_initial','2025-11-21 01:07:25.978805'),(4,'admin','0002_logentry_remove_auto_add','2025-11-21 01:07:25.980951'),(5,'admin','0003_logentry_add_action_flag_choices','2025-11-21 01:07:25.984725'),(6,'contenttypes','0002_remove_content_type_name','2025-11-21 01:07:25.998724'),(7,'auth','0002_alter_permission_name_max_length','2025-11-21 01:07:26.005693'),(8,'auth','0003_alter_user_email_max_length','2025-11-21 01:07:26.010963'),(9,'auth','0004_alter_user_username_opts','2025-11-21 01:07:26.012746'),(10,'auth','0005_alter_user_last_login_null','2025-11-21 01:07:26.018906'),(11,'auth','0006_require_contenttypes_0002','2025-11-21 01:07:26.019145'),(12,'auth','0007_alter_validators_add_error_messages','2025-11-21 01:07:26.020969'),(13,'auth','0008_alter_user_username_max_length','2025-11-21 01:07:26.029063'),(14,'auth','0009_alter_user_last_name_max_length','2025-11-21 01:07:26.036877'),(15,'auth','0010_alter_group_name_max_length','2025-11-21 01:07:26.040645'),(16,'auth','0011_update_proxy_permissions','2025-11-21 01:07:26.042538'),(17,'auth','0012_alter_user_first_name_max_length','2025-11-21 01:07:26.050032'),(18,'authtoken','0001_initial','2025-11-21 01:07:26.057535'),(19,'authtoken','0002_auto_20160226_1747','2025-11-21 01:07:26.065212'),(20,'authtoken','0003_tokenproxy','2025-11-21 01:07:26.065690'),(21,'authtoken','0004_alter_tokenproxy_options','2025-11-21 01:07:26.066606'),(22,'dev_sistema_escolar_api','0001_initial','2025-11-21 01:07:26.074413'),(23,'dev_sistema_escolar_api','0002_administradores_delete_profiles','2025-11-21 01:07:26.085431'),(24,'dev_sistema_escolar_api','0003_alumnos_maestros','2025-11-21 01:07:26.107081'),(25,'sessions','0001_initial','2025-11-21 01:07:26.110239'),(26,'dev_sistema_escolar_api','0004_alter_administradores_options_alter_alumnos_options_and_more','2025-11-21 01:38:11.683291'),(27,'dev_sistema_escolar_api','0005_eventoacademico','2025-12-05 06:01:17.109602'),(28,'dev_sistema_escolar_api','0006_alter_eventoacademico_id','2025-12-05 06:01:17.113400'),(29,'dev_sistema_escolar_api','0007_eventoregistro','2025-12-05 06:51:10.337829'),(30,'dev_sistema_escolar_api','0008_alter_eventoregistro_id','2025-12-05 06:51:10.341293');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('x8243v7aypfm6wn6gnnyc7se23pnq18w','.eJxVjDsOwjAQBe_iGlmO179Q0nMGa3ft4ACypTipEHeHSCmgfTPzXiLitpa49bzEOYmzMOL0uxHyI9cdpDvWW5Pc6rrMJHdFHrTLa0v5eTncv4OCvXzrMI3ec2LHGZxlp0lpoKxBJe0hmAkAs_cExnjUzlmFw2A12VFRoGTE-wPaFzc7:1vMG4m:zprACh4qmaLptezj3BLrplewa7v4Tg30oiM5RcWqBwI','2025-12-05 01:36:40.381522');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-05  2:45:40
