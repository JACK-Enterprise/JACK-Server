module.exports = function(app, passport, isAdmin) {
  //status route
  //TODO: develop the different features permitting to send the required informations to the template
  //TODO: develop the features that permits to interact with the server.
  app.get('/status', isAdmin, function(req, res) {
  	res.render('status.ejs',{
      user: req.user
    });
  });
}
