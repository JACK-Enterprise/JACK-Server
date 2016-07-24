module.exports = function(app, passport, isLoggedIn) {
  //status route
  //TODO: develop the different features permitting to send the required informations to the template
  //TODO: develop the features that permits to interact with the server.
  app.get('/status', isLoggedIn, function(req, res) {
  	res.render('status.ejs');
  });  
}
