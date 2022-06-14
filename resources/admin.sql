# Database code based on this great course taught by Kevin Skoglund:
# PHP: Object-Oriented Programming with Databases
# https://www.linkedin.com/learning/php-object-oriented-programming-with-databases
# I highly recommend it.
USE chain_gang;

CREATE TABLE admins (
    id              INT (11) AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR (255) NOT NULL,
    last_name       VARCHAR (255) NOT NULL,
    email           VARCHAR (255) NOT NULL,
    username        VARCHAR (255) NOT NULL,
    hashed_password VARCHAR (255) NOT NULL
);

ALTER TABLE admins ADD INDEX index_username (username);