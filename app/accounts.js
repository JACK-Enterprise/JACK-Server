module.exports = function(app, passport, isAdmin, connection) {
  //Account Manager
  app.get('/accountm', isAdmin, function(req, res) {
  	connection.query("SELECT * FROM users", function(err, rows){
  		console.log(rows);
  		res.render('accountm.ejs', {
  			users: rows,
  			message: req.flash('addMessage'),
        user: req.user
  		});
  	});
  });

  //Single Account page
  app.get('/account/:username', isAdmin, function(req, res) {
  			connection.query("SELECT * FROM users WHERE username = ?",[req.params.username.slice(1)], function(err, rows){
  				res.render('account.ejs',{
  					user:rows[0]
  				});
  		});
  });
}
