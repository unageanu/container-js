define(function(){
    var TestClass = function( args ){};
    TestClass.prototype.initialize = function(){
        if ( this.raisesErrorOnInitialize ) {
            throw new Error("failed to initialize.");
        }
       this.initialized = true; 
    };
    TestClass.prototype.destroy = function(){
        if ( this.raisesErrorOnDestroy ) {
            throw new Error("failed to destroy.");
        }
        this.destroyed = true; 
     };
    return TestClass;
});

