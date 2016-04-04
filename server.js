var express = require ('express');
var morgan  = require('morgan');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello Jack World!');
});

app.listen(4242, function () {
  console.log( 'app listening on port 4242!');
});
