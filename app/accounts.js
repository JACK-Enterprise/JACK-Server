module.exports = function(app, passport, isLoggedIn, connection) {
  //Account Manager
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
  app.get('/account/:username', isLoggedIn, function(req, res) {
  			connection.query("SELECT * FROM users WHERE username = ?",[req.params.username.slice(1)], function(err, rows){
  				res.render('account.ejs',{
  					user:rows[0]
  				});
  		});
  });
}
