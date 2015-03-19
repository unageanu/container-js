define(["app/utils/observable"], function(Observable){
    
    "use strict";
    
    /**
     * @class
     */
    var BModel = function() {};
    
    BModel.prototype = new Observable();
    
    /**
     * @public
     * @return {string}
     */
    BModel.prototype.initialize = function() {
        this.fire( "updated", { 
            property: "message", 
            value :" b."
        });
    };
    
    return BModel;
});