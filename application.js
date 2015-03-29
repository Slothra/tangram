var express = require('express')

var app = express();

app.use(express.static('public'));
var port = process.env.PORT || 8080;

app.get('/', function (req, res) {
	res.send("<!DOCTYPE html> \
<html lang='en'> \
<head> \
  <link rel='stylesheet' href='/stylesheets/normalize.css'> \
  <link rel='stylesheet' href='/stylesheets/application.css'> \
  <script src='//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js'></script> \
  <script src='/javascript/phaser.min.js'></script> \
  <script src='/javascript/application.js'></script> \
  <title></title> \
</head> \
<body> \
  <div id='game-space'>Hello</div> \
</body> \
</html>");
})

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

// app.listen(3000);