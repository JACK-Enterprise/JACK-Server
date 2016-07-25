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
	require("./adduser")(app, passport, isAdmin);
	require("./home")(app, passport, isLoggedIn);
	require("./accounts")(app, passport, isAdmin, connection);
	require("./plugins")(app, passport, isLoggedIn, isAdmin, connection);
	require("./status")(app, passport, isAdmin);
	require("./profile")(app, passport, isAdmin, connection);
	require("./edition")(app, passport, isAdmin, connection);
	require("./delete")(app, passport, isAdmin, connection);
	require("./logout")(app, passport, isLoggedIn);
	require("./401")(app, passport, isLoggedIn);

	app.get('*', function(req, res){
  	res.render('404.ejs');
	});

};
// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

function isAdmin(req, res, next){
		// if user is authenticated in the session, carry on
		if (req.isAuthenticated()){
			if (req.user.admin)
				return next();
			else{
				res.redirect('/401')
			}
		}
		res.redirect('/');
		// if they aren't redirect them to the home page
}

// route middleware
function persistance(req, res, next){
	if (req.isAuthenticated())
		res.redirect('/profile');
	//if user is authenticated, redirect him to his main page

	return next();
	//carry on.
}
