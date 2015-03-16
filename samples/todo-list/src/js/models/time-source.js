define(function(){
    
    "use strict";
    
    /**
     * @class
     */
    var TimeSource = function() {};

    /**
     * @public
     * @return {Date}
     */
    TimeSource.prototype.now = function( ) {
        return new Date();
    };
    
    return Object.freeze(TimeSource);
});