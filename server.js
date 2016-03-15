var express = require ('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello Jack World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 4242!');
});
