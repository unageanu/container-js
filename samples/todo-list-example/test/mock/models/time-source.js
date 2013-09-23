define(function(){
    
    "use strict";
    
    /**
     * @class
     */
    var TimeSource = function() {
        this.date = new Date();
    };

    /**
     * @public
     * @return {Date}
     */
    TimeSource.prototype.now = function( ) {
        return this.date;
    };
    
    /**
     * @public
     * @return {Date}
     */
    TimeSource.prototype.set = function( y, m, d, h, mi, s ) {
        this.date = new Date(y, m-1, d, h || 0, mi || 0, s || 0);
    };
    
    return Object.freeze(TimeSource);
});