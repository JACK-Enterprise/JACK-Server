module.exports = function(app, passport, isLoggedIn, connection) {
  //Plugins list route
  app.get('/plugins', isLoggedIn, function(req, res) {
  	connection.query("SELECT * FROM plugins", function(err, rows){
  		console.log(rows);
  		res.render('plugins.ejs', {
  			plugins: rows,
  			message: req.flash('addMessage')
  		});
  	});
  });

  app.get('/plugin/:pluginname', isLoggedIn, function(req, res){
  	res.render('plugin.ejs');
  });

  app.get('/addplugin', isLoggedIn, function(req, res){
  	res.render('addplugin.ejs');
  });
}
