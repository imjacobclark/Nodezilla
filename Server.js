var express = require('express'),
	app 	= express(),
	nz 		= require('./Nodezilla'),
	nt 		= "";

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/start/:url/:virtualusers', function (req, res) {
	res.set('Content-Type', 'application/json');

	nt 		= new nz(req.param("url"), req.param("virtualusers")),
	cc 		= nt.createClients();

	res.send('{"status": "ok"}');
});

app.get('/details', function (req, res) {
	res.set('Content-Type', 'application/json');
	res.send(
			{
				"mediumLoadTime": nt.mediumPageLoad().toString(),
				"requests": nt.reqMade.toString(),
				"success": nt.successful.toString(),
				"error": nt.error.toString(),
				"virtualusers": nt.virtualUsers.toString(),
				"host": nt.options.host.toString(),
			}
		);
});

app.get('/stop', function (req, res) {
	nt.shouldHalt();
	res.send('{"status": "ok"}');
});

var server = app.listen(3000, function () {
	console.log("Sever is servering...")
})