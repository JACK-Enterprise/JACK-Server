module.exports = function(app, passport, isAdmin, connection) {
  // =====================================
	// DELETE SECTION ======================
	// =====================================
	// Permitting account data edition
	app.get('/delete/:username', isAdmin, function (req, res){
		connection.query("SELECT * FROM users WHERE username = ?",[req.params.username.slice(1)], function(err, rows){
			res.render('delete.ejs',{
				user:rows[0]
			});
		});
	});

	app.post('/delete/:username', isAdmin, function(req, res){
		connection.query("DELETE FROM `users` WHERE `username` = ?",[req.params.username.slice(1)], function(err, rows){
			if (err){
				console.log(err);
			}
			res.redirect('/accountm');
		});
		console.log('deletion!!');
	});
}
