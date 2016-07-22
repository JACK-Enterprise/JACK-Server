/**
 * Node this script to create the database
 */
var mysql = require('mysql');
var dbconfig = require('../config/database');
var bcrypt = require('bcrypt-nodejs');

var admin = {
    username: 'admin',
    password: bcrypt.hashSync('admin', null, null),  // use the generateHash function in our user model
    email:    'admin@admin.com',
    admin:    1
  };

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `email` CHAR(100) NOT NULL, \
    `admin` TINYINT(1) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC), \
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) \
)');



connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.plugins_table + '` ( \
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
      `name` VARCHAR(50) NOT NULL, \
      `author` VARCHAR(20) NOT NULL, \
      `version` CHAR(10), \
      `description` CHAR(200), \
      `link` CHAR(80) NOT NULL, \
          PRIMARY KEY (`id`), \
      UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');


connection.query('USE ' + dbconfig.database);
connection.query('INSERT INTO users (username, password, email, admin) values (?,?,?,?)',[admin.username, admin.password, admin.email, admin.admin], function(err, rows){
  if (err){
    console.log(err);
  }
  console.log('admin added');
});

connection.end();

console.log('Success: Database Created!')
