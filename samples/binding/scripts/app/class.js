define(function(){
    
    "use strict";
    
    /**
     * @class
     */
    var Class = function() { this.n = 100; };
    
    Class.prototype.method = function( arg ) {
        return arg;
    };
    
    return Class;
});