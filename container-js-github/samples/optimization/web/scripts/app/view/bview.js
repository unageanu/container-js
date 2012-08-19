define([
    "container",
    "app/view/abstruct-view"
], function(ContainerJS, AbstructView){
    
    "use strict";
    
    /**
     * @class
     */
    var BView = function() {
        this.model = ContainerJS.Inject("app.model.BModel");
    };
    
    BView.prototype = new AbstructView();
    
    /**
     * @public
     */
    BView.prototype.initialize = function() {
        this.model.addObserver("updated", function( ev ) {
            if ( ev.property != "message" ) return;
            this.print( ev.value );
        }.bind(this));
    };
    
    return BView;
});