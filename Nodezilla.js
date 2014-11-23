var Nodezilla = function(url, virtualusers){
    this.http            =   require('http'),
    this.virtualUsers    =   virtualusers,
    this.halt            =   false,
    this.limiting        =   false,
    this.reqMade         =   0,
    this.reqLimit        =   2,
    this.hrtime          =   process.hrtime(),
    this.times           =   [],
    this.successful      =   0,
    this.error           =   0,
    this.options         =   {
        host: url
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

    if(!this.halt){
        this.http.get(this.options, function(resp){
            resp.on('data', function(){})
                .on("connection", function(){
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
    this.halt = true;
}

Nodezilla.prototype.mediumPageLoad = function(){
    var total = 0;
    for(var i = 0; i < this.times.length; i++){
        total = total + this.times[i];
        return total/this.times.length;
    }
}

module.exports = Nodezilla
