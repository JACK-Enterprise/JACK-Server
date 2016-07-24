module.exports = function(app, passport, isLoggedIn) {
  // Home page
  	app.get('/home', isLoggedIn, function(req, res) {
  		res.render('home.ejs');
  	});
}
