module.exports = function(app, passport, isLoggedIn) {
  app.get('/401', function(req, res){
      res.render('401.ejs')
  });
}
