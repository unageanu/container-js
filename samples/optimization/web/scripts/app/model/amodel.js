define(["app/utils/observable"], function(Observable){
    
    "use strict";
    
    /**
     * @class
     */
    var AModel = function() {};
    
    AModel.prototype = new Observable();
    
    /**
     * @public
     * @return {string}
     */
    AModel.prototype.initialize = function() {
        this.fire( "updated", { 
            property: "message", 
            value :" a."
        });
    };
    
    return AModel;
});