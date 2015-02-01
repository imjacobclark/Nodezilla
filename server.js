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
    		socket.emit("message", {"data": "<strong>Waiting...</strong>"});
    	}else{
	        socket.emit("data", nt.getDetails());
		}
    }, 10);

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
	cc 		= nt.createClients(false, 0);
	
	res.send('{"status": "ok"}');
});

app.get('/details', function (req, res) {
	res.set('Content-Type', 'application/json');

	if(nt == ""){
		res.send({"status": false})
	}else{
		res.send(nt.getDetails());
	}
});

app.get('/stop', function (req, res) {
	nt.shouldHalt();
	res.send('{"status": "ok"}');
});

app.get('/reset', function(req, res){
	nt.shouldHalt();
	nt = "";
	res.send('{"status": "ok"}');
})

http.listen(process.env.PORT || 3000, function(){
  console.log('Nodezilla is now listening on port 3000.');
});
