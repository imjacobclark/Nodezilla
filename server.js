var express 	= require('express'),
	app 		= express(),
	http 		= require('http').Server(app),
	io 			= require('socket.io')(http),
	nz 			= require('./Nodezilla'),
	nt 			= "";

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

io.on("connection", function (socket) {
    var interval = setInterval(function () {
    	if(nt == ""){
    		socket.emit("message", {"data": "<strong>Waiting for data...</strong>"});
    	}else{
	        socket.emit("data", {
				"mediumLoadTime": nt.mediumPageLoad(),
				"firstLoadTime": nt.times[0],
				"lastLoadTime": nt.times[nt.times.length-1],
				//"times": nt.times,
				"requests": nt.reqMade.toString(),
				"success": nt.successful.toString(),
				"error": nt.error.toString(),
				"virtualusers": nt.virtualUsers.toString(),
				"host": nt.options.host.toString(),
			});
		}
    }, 100);

    socket.on("disconnect", function () {
        clearInterval(interval);
    });
});

app.get('/', function(req, res){
	res.render('index');
});

app.get('/start/:url/:virtualusers', function (req, res) {
	res.set('Content-Type', 'application/json');

	nt 		= new nz(req.param("url"), req.param("virtualusers")),
	cc 		= nt.createClients(0);

	res.send('{"status": "ok"}');
});

app.get('/details', function (req, res) {
	res.set('Content-Type', 'application/json');
	res.send(
			{
				"mediumLoadTime": nt.mediumPageLoad(),
				"firstLoadTime": nt.times[0],
				"lastLoadTime": nt.times[nt.times.length-1],
				"times": nt.times,
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

http.listen(3000, function(){
  console.log('Nodezilla is now listening on port 3000.');
});