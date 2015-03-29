var express = require('express')

var app = express();

app.use(express.static('public'));
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
	res.render('index.html')
})

// app.listen(port, function() {
//     console.log('Our app is running on http://localhost:' + port);
// });

app.listen(port);