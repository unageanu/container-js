define( function(){
    
    "use strict";
    
    /**
     * @class
     */
    var Observable = function() {
        
        /**
         * @type {Object.<string, Array.<function(*):void>>}
         */
        this.observers = {};
    };
    
    /**
     * @public
     * @param {!string} eventId
     * @param {function(*):void} observerFunction
     */
    Observable.prototype.addObserver = function(
            eventId, observerFunction ) {
        var observers = this.observers[eventId] 
                            || (this.observers[eventId] = []);
        observers.push(observerFunction);
    };
    
    /**
     * @protected
     * @param {!string} eventId
     * @param {*} event
     */
    Observable.prototype.fire = function( eventId, event ) {
        var observers = this.observers[eventId];
        if (!observers) return;
        observers.forEach( function( f ) {
            f(event);
        });
    };
    
    return  Observable;
});