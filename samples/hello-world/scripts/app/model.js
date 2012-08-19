define(["utils/observable"], function(Observable){
    
    "use strict";
    
    /**
     * @class
     */
    var Model = function() {};
    
    Model.prototype = new Observable();
    
    /**
     * @public
     */
    Model.prototype.initialize = function() {
        this.fire( "updated", { 
            property: "message", 
            value :"hello world."
        });
    };
    
    return Model;
});