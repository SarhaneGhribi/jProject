SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema myfoundation
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema myfoundation
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `myfoundation` DEFAULT CHARACTER SET utf8 ;
USE `myfoundation` ;

-- -----------------------------------------------------
-- Table `myfoundation`.`foundations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `myfoundation`.`foundations` (
  `idfoundations` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(70) NOT NULL,
  `funds` INT NOT NULL,
  `logo` VARCHAR(255) NULL,
  `goal` INT NULL,
  PRIMARY KEY (`idfoundations`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myfoundation`.`doners`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `myfoundation`.`doners` (
  `iddoners` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`iddoners`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myfoundation`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `myfoundation`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NULL,
  `google_id` VARCHAR(255) NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_users_email` (`email` ASC),
  UNIQUE INDEX `uq_users_google_id` (`google_id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myfoundation`.`otp_codes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `myfoundation`.`otp_codes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `code_hash` VARCHAR(255) NOT NULL,
  `purpose` VARCHAR(20) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `consumed` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_otp_user` (`user_id` ASC),
  CONSTRAINT `fk_otp_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `myfoundation`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myfoundation`.`password_resets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `myfoundation`.`password_resets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `consumed` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_reset_user` (`user_id` ASC),
  CONSTRAINT `fk_reset_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `myfoundation`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myfoundation`.`donations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `myfoundation`.`donations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `foundation_id` INT NOT NULL,
  `amount` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_donations_user` (`user_id` ASC),
  INDEX `idx_donations_foundation` (`foundation_id` ASC),
  CONSTRAINT `fk_donations_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `myfoundation`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_donations_foundation`
    FOREIGN KEY (`foundation_id`)
    REFERENCES `myfoundation`.`foundations` (`idfoundations`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
