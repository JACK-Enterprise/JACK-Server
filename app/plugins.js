var formidable = require('formidable');
var http = require('http');
var util = require('util');
var fs   = require('fs-extra');
var path = require("path");

module.exports = function(app, passport, isLoggedIn, connection) {
  //Plugins list route
  app.get('/plugins', isLoggedIn, function(req, res) {
  	connection.query("SELECT * FROM plugins", function(err, rows){
  		console.log(rows);
  		res.render('plugins.ejs', {
  			plugins: rows,
  			message: req.flash('message')
  		});
  	});
  });

  app.get('/plugin/:pluginname', isLoggedIn, function(req, res){
  	res.render('plugin.ejs');
  });

  app.get('/addplugin', isLoggedIn, function(req, res){
  	res.render('addplugin.ejs');
  });

  app.post('/addplugin', isLoggedIn, function(req, res){
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname +'/uploads/';
    form.encoding = 'utf-8';
    form.maxFieldsSize = 30 * 1024 * 1024;
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        connection.query("INSERT INTO plugins (name, author, version, description, link, size) values (?,?,?,?,?,?)",[fields.name, fields.author, fields.version, fields.description, files.upload.path, files.upload.size],function(err, rows){
          if(err){
            console.log(err);
          }else{
            console.log(rows);
          }
        });
        res.end(util.inspect({fields: fields, files: files}));
        //util.inspect({fields: fields, files: files})
    });

    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
    });

    form.on('error', function(err) {
        console.error(err);
    });
    form.on('aborted', function(err) {
      console.error(err);
    });

    form.on('end', function (fields, files) {

      });

      return;
    });

 };
