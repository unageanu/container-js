define(["container"], function( ContainerJS ){
    
    "use strict";
    
    /**
     * @class
     */
    var View = function() {
        this.model = ContainerJS.Inject("app.Model");
    };
    
    /**
     * @public
     */
    View.prototype.initialize = function() {
        this.model.addObserver("updated", function( ev ) {
            if ( ev.property != "message" ) return;
            var e = document.getElementById(this.elementId);
            e.innerHTML = ev.value; 
        }.bind(this));
    };
    
    return View;
});