var express = require('express'),
	app 	= express(),
	nz 		= require('./Nodezilla'),
	nt 		= new nz();

app.set('views', __dirname + '/views')
app.set('view engine', 'jade');

app.get('/', function (req, res) {
	cc = nt.createClients();
	res.send("Clients created.");
});

app.get('/summary', function(req, res){
	res.render('index', { nodezilla: nt });
})

var server = app.listen(3000, function () {
	console.log("Sever is servering...")
})