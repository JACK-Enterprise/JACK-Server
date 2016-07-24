module.exports = function(app, passport, isLoggedIn, connection) {
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

}
