define( function(){
    
    "use strict";
    
    /**
     * @class
     */
    var AbstructView = function() {};
    
    /**
     * @public
     * @param {!string} message
     */
    AbstructView.prototype.print = function(message) {
        var e = document.getElementById("console");
        e.innerHTML += message + "<br/>";
    };
    
    return AbstructView;
});