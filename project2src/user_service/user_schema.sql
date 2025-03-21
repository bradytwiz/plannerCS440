-- create the database
CREATE DATABASE IF NOT EXISTS user_db;

-- use scheduler database
USE user_db;

-- create tables for database
CREATE TABLE IF NOT EXISTS user (
	id INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
