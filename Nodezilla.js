var Nodezilla = function(url, virtualusers, batched, batchedThreads, batchedSpawnTime){
    this.http                   =   require('http'),
    this.virtualUsers           =   virtualusers,
    this.batched                =   batched,
    this.batchedThreads         =   batchedThreads,
    this.batchedSpawnTime       =   batchedSpawnTime,
    this.halt                   =   false,
    this.reqMade                =   0,
    this.hrtime                 =   process.hrtime(),
    this.times                  =   [],
    this.successful             =   0,
    this.error                  =   0,
    this.options                =   {
        host: url
    };
}

Nodezilla.prototype.createClients = function(batched, i){
    var self = this;

    if(batched)
        batchRequests();

    this.recursiveRequest();

    if(batched == false && i < this.virtualUsers){
        setTimeout( function() {
            self.createClients(false, i+1);
        }, 0 );  
    }else{
        this.recursiveRequest();
    }
}

Nodezilla.prototype.batchRequests = function(){
    var self = this;

    setTimeout( function() {
        for(var i = 0; i < this.batchedThreads; i++){
            self.createClients(true);
        }
        self.batchRequests();
    }, this.batchedSpawnTime );
}

Nodezilla.prototype.recursiveRequest = function(){
    var self    =   this;
    self.hrtime =   process.hrtime();

    if(!this.halt){
        self.reqMade++;
        
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
        return total/this.times.length.toString();
    }
}

module.exports = Nodezilla
