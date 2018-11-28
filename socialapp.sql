-- phpMyAdmin SQL Dump
-- version 4.0.10.20
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 28, 2018 at 07:33 AM
-- Server version: 5.6.41
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `socialapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `block_users`
--

CREATE TABLE IF NOT EXISTS `block_users` (
  `blockId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `blockingUserId` int(11) unsigned NOT NULL,
  `blockedUserId` int(11) unsigned NOT NULL,
  `blockStatus` enum('true','false') NOT NULL DEFAULT 'true',
  PRIMARY KEY (`blockId`),
  KEY `blockingUserId` (`blockingUserId`),
  KEY `blockedUserId` (`blockedUserId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `block_users`
--

INSERT INTO `block_users` (`blockId`, `blockingUserId`, `blockedUserId`, `blockStatus`) VALUES
(1, 1, 1, 'true'),
(2, 1, 4, 'false'),
(3, 4, 1, 'false');

-- --------------------------------------------------------

--
-- Table structure for table `follower_followed`
--

CREATE TABLE IF NOT EXISTS `follower_followed` (
  `relationId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `followerId` int(11) unsigned NOT NULL,
  `followedId` int(11) unsigned NOT NULL,
  `followStatus` enum('true','false') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`relationId`),
  KEY `followerId` (`followerId`),
  KEY `followedId` (`followedId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `follower_followed`
--

INSERT INTO `follower_followed` (`relationId`, `followerId`, `followedId`, `followStatus`) VALUES
(1, 1, 2, 'true'),
(2, 4, 1, 'true'),
(7, 4, 3, 'true'),
(8, 3, 4, 'true'),
(9, 2, 3, 'true');

-- --------------------------------------------------------

--
-- Table structure for table `invite_user`
--

CREATE TABLE IF NOT EXISTS `invite_user` (
  `invitingId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `invitingUserId` int(11) unsigned NOT NULL,
  `invitedEmailAddress` varchar(100) NOT NULL,
  `accepted` enum('true','false') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`invitingId`),
  KEY `invitingUserId` (`invitingUserId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `invite_user`
--

INSERT INTO `invite_user` (`invitingId`, `invitingUserId`, `invitedEmailAddress`, `accepted`) VALUES
(5, 1, 'jose.pinto@hodlfinance.com', 'false');

-- --------------------------------------------------------

--
-- Table structure for table `like_post`
--

CREATE TABLE IF NOT EXISTS `like_post` (
  `likeId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `postId` int(11) unsigned NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `likeStatus` enum('true','false') NOT NULL DEFAULT 'true',
  `createdOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`likeId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `like_post`
--

INSERT INTO `like_post` (`likeId`, `postId`, `userId`, `likeStatus`, `createdOn`) VALUES
(14, 1, 4, 'false', '2018-11-27 17:24:28'),
(15, 2, 4, 'true', '2018-11-27 17:24:29'),
(16, 29, 4, 'false', '2018-11-27 19:00:19'),
(17, 5, 4, 'true', '2018-11-27 19:29:38');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE IF NOT EXISTS `notifications` (
  `notificationId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `receivingUserId` int(11) unsigned NOT NULL,
  `triggeringUserId` int(11) unsigned NOT NULL,
  `message` varchar(255) NOT NULL,
  `type` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `seen` varchar(10) NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notificationId`),
  KEY `receivingUserId` (`receivingUserId`),
  KEY `receivingUserId_2` (`receivingUserId`),
  KEY `triggering_userId` (`triggeringUserId`),
  KEY `notifications_ibfk_1` (`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notificationId`, `receivingUserId`, `triggeringUserId`, `message`, `type`, `postId`, `seen`, `createdOn`) VALUES
(1, 2, 4, '', 1, 0, 'false', '2018-11-27 06:44:44'),
(2, 1, 2, '', 1, 0, 'true', '2018-11-27 06:45:25'),
(3, 4, 2, '', 1, 0, 'false', '2018-11-27 06:45:28'),
(4, 1, 4, '', 1, 0, 'true', '2018-11-27 06:52:27'),
(5, 3, 4, '', 1, 0, 'false', '2018-11-27 07:04:28'),
(6, 1, 4, '', 1, 0, 'false', '2018-11-27 07:05:30'),
(7, 1, 1, '', 1, 0, 'false', '2018-11-27 10:19:18'),
(8, 1, 1, '', 1, 0, 'false', '2018-11-27 10:21:39'),
(9, 1, 1, '', 1, 0, 'false', '2018-11-27 12:08:56');

-- --------------------------------------------------------

--
-- Table structure for table `notifications_preferences`
--

CREATE TABLE IF NOT EXISTS `notifications_preferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `notificationType` int(11) NOT NULL,
  `status` enum('true','false') NOT NULL DEFAULT 'true',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `notifications_preferences`
--

INSERT INTO `notifications_preferences` (`id`, `userId`, `notificationType`, `status`) VALUES
(1, 4, 2, 'true');

-- --------------------------------------------------------

--
-- Table structure for table `notification_type`
--

CREATE TABLE IF NOT EXISTS `notification_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `notification_type`
--

INSERT INTO `notification_type` (`id`, `name`) VALUES
(1, 'like'),
(2, 'repost'),
(3, 'reply'),
(4, 'follow'),
(5, 'mention'),
(6, 'post');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE IF NOT EXISTS `post` (
  `postId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `repostId` int(11) unsigned DEFAULT NULL,
  `userId` int(11) unsigned NOT NULL,
  `text` text NOT NULL,
  `postImage` varchar(255) DEFAULT NULL,
  `hashTag` varchar(10) DEFAULT NULL,
  `parentId` int(10) unsigned NOT NULL,
  `hidden` enum('true','false') NOT NULL DEFAULT 'false',
  `createdOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `postStatus` enum('true','false') NOT NULL DEFAULT 'true',
  PRIMARY KEY (`postId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=30 ;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`postId`, `repostId`, `userId`, `text`, `postImage`, `hashTag`, `parentId`, `hidden`, `createdOn`, `postStatus`) VALUES
(1, 0, 3, '$BTC and $ETH is going down.', '9393df3361b14ae76c8b35387517753f1543228505233.jpeg', 'test,blog,', 0, 'false', '2018-11-26 10:35:06', 'true'),
(2, 0, 1, '$BTC and $ETH is going down.', '537505f8b948a2fa38c18b0771f037511543228516622.jpeg', 'test,blog,', 0, 'false', '2018-11-26 10:35:18', 'true'),
(5, 0, 1, 'test reply post', '8db66800891ff846d154f875cc3d646c1543228552735.jpeg', 'ETH', 1, 'false', '2018-11-26 10:35:56', 'true'),
(28, 0, 2, '$BTC and $ETH is going down.', '537505f8b948a2fa38c18b0771f037511543228516622.jpeg', 'test,blog,', 0, 'false', '2018-11-26 10:35:18', 'true'),
(29, 0, 4, '$ETH dsadsad dafdsafas', '2eefb4715e3b06147ab999356f6856301543337413384.jpeg', 'undefined', 0, 'false', '2018-11-27 16:50:14', 'true');

-- --------------------------------------------------------

--
-- Table structure for table `subscribe`
--

CREATE TABLE IF NOT EXISTS `subscribe` (
  `subscriptionId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subscribingUserId` int(10) unsigned NOT NULL,
  `subscribedUserId` int(10) unsigned NOT NULL,
  `subscriptionStatus` enum('true','false') NOT NULL DEFAULT 'false',
  PRIMARY KEY (`subscriptionId`),
  KEY `subscribingUserId` (`subscribingUserId`),
  KEY `subscribedUserId` (`subscribedUserId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `subscribe`
--

INSERT INTO `subscribe` (`subscriptionId`, `subscribingUserId`, `subscribedUserId`, `subscriptionStatus`) VALUES
(1, 1, 2, 'false'),
(3, 1, 2, 'false'),
(6, 1, 1, 'true'),
(7, 1, 5, 'true'),
(9, 1, 4, 'true'),
(10, 6, 1, 'true'),
(12, 6, 2, 'true');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `userId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userName` varchar(30) NOT NULL,
  `fullName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `facebookId` bigint(20) unsigned NOT NULL,
  `googleId` char(21) NOT NULL,
  `emailVerify` enum('true','false') NOT NULL DEFAULT 'false',
  `blockedStatus` enum('true','false') NOT NULL DEFAULT 'false',
  `forgotToken` varchar(20) DEFAULT NULL,
  `forgotOTP` char(6) NOT NULL,
  `deviceType` varchar(10) DEFAULT NULL,
  `userDeviceToken` varchar(55) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  KEY `email` (`email`),
  KEY `userName` (`userName`),
  KEY `facebookId` (`facebookId`),
  KEY `googleId` (`googleId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `userName`, `fullName`, `email`, `password`, `facebookId`, `googleId`, `emailVerify`, `blockedStatus`, `forgotToken`, `forgotOTP`, `deviceType`, `userDeviceToken`, `createdAt`) VALUES
(1, 'user 1', 'Taps Bhardwaj user 1', 'bhardwaj.tripti12384@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-23 12:56:01'),
(2, 'tripti_2', 'Tripti Bhardwaj user 2', 'bhardwaj.tripti2@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-23 13:01:43'),
(3, 'user 3', 'Deep Verma user 3 ', 'test900@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-23 13:02:30'),
(4, 'hodltester', 'HODL Tester', 'hodltester@hodlfinance.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 1232345678905441245, '123234567890544112223', 'false', 'false', '0', '0', NULL, NULL, '2018-11-23 13:59:28'),
(5, 'jco40', 'Justus Ohlhaver', 'ohlhaver@gmail.com', NULL, 10156643018560502, '0', 'false', 'false', '0', '0', NULL, NULL, '2018-11-23 22:20:25'),
(6, 'jco400', 'Peter Peterson', 'jco40@columbia.edu', 'e10adc3949ba59abbe56e057f20f883e', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-24 11:50:26'),
(7, 'teste123123', 'Teste123', 'teste@cenas.teste', 'f6fd1939bdf31481d27ac4344a2aab58', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-26 10:04:38'),
(8, 'test987', 'Teste 9', 'test9@teste.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-26 15:08:29'),
(9, 'qwerty1', 'QWERTY 1', 'qwerty1@test.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-26 15:19:35'),
(10, 'qwerty2', 'QWERTY', 'qwerty2@qwerty.com', '4cc2321ca77b832bd20b66f86f85bef6', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-26 15:30:06'),
(11, 'qwerty3', 'QWERTY', 'qwerty3@qwerty.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-26 17:24:40'),
(12, 'qwerty4', 'QWERTY', 'qwerty4@qwerty.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-26 17:25:42'),
(13, 'qwerty5', 'Qwerty', 'qwerty5@qwerty.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-26 17:26:32'),
(14, 'qwerty6', 'Qwerty', 'qwerty6@qwerty.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-26 17:58:02'),
(15, 'qwerty7', 'Qwery', 'qwerty7@werty.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-26 18:02:39'),
(16, 'qwerty9', 'Qwerty', 'testeeee@teste.com', 'd8578edf8458ce06fbc5bb76a58c5ca4', 0, '', 'false', 'false', '0', '0', NULL, NULL, '2018-11-27 17:59:46');

-- --------------------------------------------------------

--
-- Table structure for table `user_device`
--

CREATE TABLE IF NOT EXISTS `user_device` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `deviceId` varchar(255) NOT NULL,
  `deviceType` varchar(10) NOT NULL,
  `userDeviceToken` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE IF NOT EXISTS `user_info` (
  `userId` int(11) unsigned NOT NULL,
  `bio` text,
  `location` varchar(50) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `userImage` varchar(100) DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  PRIMARY KEY (`userId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`userId`, `bio`, `location`, `website`, `userImage`, `birthDate`) VALUES
(1, NULL, NULL, NULL, NULL, NULL),
(2, NULL, NULL, NULL, NULL, NULL),
(3, NULL, NULL, NULL, NULL, NULL),
(4, 'Studied in Universidade da vida', 'Lisbon, Portugal', 'undefined', 'bf2dae1dc89fb422ca9b5887404240121543254234458.jpeg', '1991-11-27'),
(5, NULL, NULL, NULL, NULL, NULL),
(6, NULL, NULL, NULL, NULL, NULL),
(7, NULL, NULL, NULL, NULL, NULL),
(8, NULL, NULL, NULL, NULL, NULL),
(9, NULL, NULL, NULL, NULL, NULL),
(10, NULL, NULL, NULL, NULL, NULL),
(11, NULL, NULL, NULL, NULL, NULL),
(12, NULL, NULL, NULL, NULL, NULL),
(13, NULL, NULL, NULL, NULL, NULL),
(14, NULL, NULL, NULL, NULL, NULL),
(15, NULL, NULL, NULL, NULL, NULL),
(16, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_master`
--

CREATE TABLE IF NOT EXISTS `user_master` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `block_users`
--
ALTER TABLE `block_users`
  ADD CONSTRAINT `block_users_ibfk_1` FOREIGN KEY (`blockedUserId`) REFERENCES `user` (`userId`),
  ADD CONSTRAINT `block_users_ibfk_2` FOREIGN KEY (`blockingUserId`) REFERENCES `user` (`userId`);

--
-- Constraints for table `follower_followed`
--
ALTER TABLE `follower_followed`
  ADD CONSTRAINT `follower_followed_ibfk_1` FOREIGN KEY (`followerId`) REFERENCES `user` (`userId`),
  ADD CONSTRAINT `follower_followed_ibfk_2` FOREIGN KEY (`followedId`) REFERENCES `user` (`userId`);

--
-- Constraints for table `invite_user`
--
ALTER TABLE `invite_user`
  ADD CONSTRAINT `invite_user_ibfk_1` FOREIGN KEY (`invitingUserId`) REFERENCES `user` (`userId`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`type`) REFERENCES `notification_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `reciving_user_id` FOREIGN KEY (`receivingUserId`) REFERENCES `user` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `triggering_userId` FOREIGN KEY (`triggeringUserId`) REFERENCES `user` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`);

--
-- Constraints for table `subscribe`
--
ALTER TABLE `subscribe`
  ADD CONSTRAINT `subscribe_ibfk_1` FOREIGN KEY (`subscribedUserId`) REFERENCES `user` (`userId`),
  ADD CONSTRAINT `subscribe_ibfk_2` FOREIGN KEY (`subscribingUserId`) REFERENCES `user` (`userId`);

--
-- Constraints for table `user_device`
--
ALTER TABLE `user_device`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user_info`
--
ALTER TABLE `user_info`
  ADD CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
