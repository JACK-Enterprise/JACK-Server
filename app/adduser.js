
module.exports = function(app, passport, isLoggedIn) {
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
}
