var http 	= require('http');
var nz 		= require('./Nodezilla')
var nt 		= new nz();

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	var cc = nt.createClients();

	if(req.url == "/"){
		console.log(cc);
	}else{
		res.write("Using a total of " + nt.virtualUsers + " virtual clients I have load tested " + nt.options.host + ".<br/>")
		res.write("I have made a total of " + nt.reqMade + " requests, " + nt.successful + " were successful and " + nt.error + " failed.<br/>");
		res.write("I calculated a medium page load time of " + nt.mediumPageLoad() + ".");
		res.end("");
	}

}).listen(1337, '0.0.0.0');
