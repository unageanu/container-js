define(["container"], function( ContainerJS ){
    
    "use strict";
    
    /**
     * @class
     */
    var Owner = function() {
        this.component = ContainerJS.Inject.lazily("app.Component");
        print("owner : created.");
    };
    
    /**
     * @public
     */
    Owner.prototype.initialize = function() {
        print( "owner : initialize." );
        this.component.then(function( component){
        }, function( error ) {
            alert( error.toString() ); 
        });
    };
    
    return Owner;
});