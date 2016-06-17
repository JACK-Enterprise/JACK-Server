// app/routes.js

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

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', persistance, function(req, res) {
		if (req.isAuthenticated())
			res.redirect('/profile');
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });

	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', persistance, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


// Home page
	app.get('/home', isLoggedIn, function(req, res) {
		res.render('home.ejs');
	});

//Account Manager
//TODO: include an isAdministrator function to authorize or not this page access

app.get('/accountm', isLoggedIn, function(req, res) {
	connection.query("SELECT * FROM users", function(err, rows){
		console.log(rows);
		res.render('accountm.ejs', {
			users: rows
		});
	});
});

//Plugins list route
//TODO: plugins objet to pass to the template for a listing of all the plugins.

app.get('/plugins', isLoggedIn, function(req, res) {
	res.render('plugins.ejs');
});

//status route
//TODO: develop the different features permitting to send the required informations to the template
//TODO: develop the features that permits to interact with the server.
app.get('/status', isLoggedIn, function(req, res) {
	res.render('status.ejs');
});

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
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

// route middleware
function persistance(req, res, next){
	if (req.isAuthenticated())
		res.redirect('/profile');
	//if user is authenticated, redirect him to his main page

	return next();
	//carry on.
}
