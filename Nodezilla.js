var Nodezilla = function(){
    this.http            =   require('http'),
    this.virtualUsers    =   5000,
    this.limiting        =   false,
    this.reqMade         =   0,
    this.reqLimit        =   2,
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
    var self    =   this;
    self.hrtime =   process.hrtime();

    self.reqMade++;

    if(!this.shouldHalt()){
        this.http.get(this.options, function(resp){
            resp.on('data', function(){})
                .on("connection", function(){
                    console.log("Connected")
                })
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

        this.times.push(ms);
        this.successful++;
        this.recursiveRequest();
}

Nodezilla.prototype.shouldHalt = function(){
    if(this.limiting == true && this.reqMade >= this.reqLimit){
        return true;
    }
}

Nodezilla.prototype.mediumPageLoad = function(){
    var total = 0;
    for(var i = 0; i < this.times.length; i++){
        total = total + this.times[i];
        return total/this.times.length;
    }
}

module.exports = Nodezilla
