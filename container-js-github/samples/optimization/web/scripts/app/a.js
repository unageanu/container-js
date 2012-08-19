define(["container","app/common"], function(ContainerJS){
    
    "use strict";
    
    /**
     * @class
     */
    var A = function() {
        this.view = ContainerJS.Inject("app.view.AView");
        this.model = ContainerJS.Inject("app.model.AModel");
    };
    
    /**
     * @public
     */
    A.prototype.initialize = function() {
        this.model.initialize();
    };
    
    return A;
});