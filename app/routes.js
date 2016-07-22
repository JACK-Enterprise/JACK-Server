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
	app.get('/adduser', isLoggedIn, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('adduser.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/adduser', passport.authenticate('local-signup', {
		successRedirect : '/accountm', // redirect to the secure profile section
		failureRedirect : '/adduser', // redirect back to the signup page if there is an error
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
			users: rows,
			message: req.flash('addMessage')
		});
	});
});

//Single Account page
//TODO: Security upgrade about account rights.
app.get('/account/:username', isLoggedIn, function(req, res) {
			connection.query("SELECT * FROM users WHERE username = ?",[req.params.username.slice(1)], function(err, rows){
				res.render('account.ejs',{
					user:rows[0]
				});
		});
});

//Plugins list route
//TODO: plugins object to pass to the template for a listing of all the plugins.

app.get('/plugins', isLoggedIn, function(req, res) {
	connection.query("SELECT * FROM plugins", function(err, rows){
		console.log(rows);
		res.render('plugins.ejs', {
			plugins: rows,
			message: req.flash('addMessage')
		});
	});
});

//status route
//TODO: develop the different features permitting to send the required informations to the template
//TODO: develop the features that permits to interact with the server.
app.get('/status', isLoggedIn, function(req, res) {
	res.render('status.ejs');
});

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// EDIT SECTION ========================
	// =====================================
	// Permitting account data edition
	app.get('/edit/:username', isLoggedIn, function(req, res){
		connection.query("SELECT * FROM users WHERE username = ?",[req.params.username.slice(1)], function(err, rows){
			res.render('edit.ejs',{
				user:rows[0]
			});
		});
	});

	app.post('/edit/:username', isLoggedIn, function(req, res){
		//query de modification
		//redirection vers la page du profil
		console.log(req.body.email);
		console.log(req.body.password);
		if (req.body.email && req.body.password){
			connection.query("UPDATE `users` SET `email`= ?, `password`= ? WHERE `username`= ?;",[req.body.email, bcrypt.hashSync(req.body.password, null, null), req.params.username.slice(1)], function(err, rows){
				if (err){
					console.log(err);
				}
				res.redirect('/accountm');
			});
		}else if (req.body.email) {
			connection.query("UPDATE `users` SET `email`= ? WHERE `username`= ?;",[req.body.email, req.params.username.slice(1)], function(err, rows){
				if (err){
					console.log(err);
				}
				res.redirect('/accountm');
			});
		}else if (req.body.password) {
			connection.query("UPDATE `users` SET `password`= ? WHERE `username`= ?;",[bcrypt.hashSync(req.body.password, null, null), req.params.username.slice(1)], function(err, rows){
				if (err){
					console.log(err);
				}
				res.redirect('/accountm');
		 	});
		}
		console.log('edition!!');
	});

	// =====================================
	// DELETE SECTION ======================
	// =====================================
	// Permitting account data edition
	app.get('/delete/:username', isLoggedIn, function (req, res){
		connection.query("SELECT * FROM users WHERE username = ?",[req.params.username.slice(1)], function(err, rows){
			res.render('delete.ejs',{
				user:rows[0]
			});
		});
	});

	app.post('/delete/:username', isLoggedIn, function(req, res){
		//query de suppression
		connection.query("DELETE FROM `users` WHERE `username` = ?",[req.params.username.slice(1)], function(err, rows){
			if (err){
				console.log(err);
			}
			res.redirect('/accountm');
		});
		console.log('deletion!!');
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
