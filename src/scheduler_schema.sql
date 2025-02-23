-- create the database
CREATE DATABASE IF NOT EXISTS scheduler_db;

-- use scheduler database
USE scheduler_db;

-- create tables for database
CREATE TABLE IF NOT EXISTS user (
	id INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS type (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    importance ENUM('Low', 'Medium', 'High') NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#FFFFFF'
);

CREATE TABLE IF NOT EXISTS event (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    type_id INT, -- foreign key reference for type table
    FOREIGN KEY (type_id) REFERENCES type(id)
);