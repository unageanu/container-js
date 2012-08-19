define([
    "container",
    "app/view/abstruct-view"
], function(ContainerJS, AbstructView){
    
    "use strict";
    
    /**
     * @class
     */
    var AView = function() {
        this.model = ContainerJS.Inject("app.model.AModel");
    };
    
    AView.prototype = new AbstructView();
    
    /**
     * @public
     */
    AView.prototype.initialize = function() {
        this.model.addObserver("updated", function( ev ) {
            if ( ev.property != "message" ) return;
            this.print( ev.value );
        }.bind(this));
    };
    
    return AView;
});