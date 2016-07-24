// app/routes.js

var bcrypt = require('bcrypt-nodejs');
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);


module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', persistance, function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	require("./login")(app, passport, persistance);
	require("./adduser")(app, passport, isLoggedIn);
	require("./home")(app, passport, isLoggedIn);
	require("./accounts")(app, passport, isLoggedIn, connection);
	require("./plugins")(app, passport, isLoggedIn, connection);
	require("./status")(app, passport, isLoggedIn);
	require("./profile")(app, passport, isLoggedIn, connection);
	require("./edition")(app, passport, isLoggedIn, connection);
	require("./delete")(app, passport, isLoggedIn, connection);
	require("./logout")(app, passport, isLoggedIn);

};
// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

// route middleware
function persistance(req, res, next){
	if (req.isAuthenticated())
		res.redirect('/profile');
	//if user is authenticated, redirect him to his main page

	return next();
	//carry on.
}
