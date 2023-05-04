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
CREATE TABLE IF NOT EXISTS `mydb`.`foundations` (
  `idfoundations` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(70) NOT NULL,
  `funds` INT NOT NULL,
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


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
