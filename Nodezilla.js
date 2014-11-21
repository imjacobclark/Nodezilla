var Nodezilla = function(){
    this.http            =   require('http'),
    this.virtualUsers    =   50,
    this.reqMade         =   0,
    this.reqLimit        =   100,
    this.hrtime          =   process.hrtime(),
    this.times           =   [],
    this.successful      =   0,
    this.error           =   0,
    this.options         =   {
        host: 'opencomputerscience.co.uk'
    };
}

Nodezilla.prototype.createClients = function(){
    for(var i = 0; i < this.virtualUsers; i++){
        this.recursiveRequest();
    }
}

Nodezilla.prototype.recursiveRequest = function(){
    var self = this;

    if(!this.shouldHalt()){
        this.http.get(this.options, function(resp){
            resp.on('data', function(){})
                .on("end", function(){
                    self.onSuccess();
                });
        })
            .on("error", function(e){
                self.onError();
            });
    }
}

Nodezilla.prototype.onError = function(){
    this.error++;
    this.reqMade++;
    this.recursiveRequest();
}

Nodezilla.prototype.onSuccess = function(){
    var elapsed     =   process.hrtime(this.hrtime),
        ms          =   elapsed[0] * 1000000 + elapsed[1] / 1000
        time        =   process.hrtime(),
        this.hrtime =   process.hrtime();

        this.times.push(ms);
        this.successful++;
        this.reqMade++;
        this.recursiveRequest();
}

Nodezilla.prototype.summary = function(){
    console.log("I made a total of " + this.successful + " successful requests and " + this.error + " failed requests.");
    console.log("These requests came from a total of " + this.virtualUsers + " virtual users.");
}

Nodezilla.prototype.shouldHalt = function(){
    if(this.reqMade >= this.reqLimit){
        this.summary();
        process.exit(1);
    }
}

var nt = new Nodezilla();
var cc = nt.createClients();
