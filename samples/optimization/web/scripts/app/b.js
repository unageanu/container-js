define(["container","app/common"], function(ContainerJS){
    
    "use strict";
    
    /**
     * @class
     */
    var B = function() {
        this.view = ContainerJS.Inject("app.view.BView");
        this.model = ContainerJS.Inject("app.model.BModel");
    };
    
    /**
     * @public
     */
    B.prototype.initialize = function() {
        this.model.initialize();
    };
    
    return B;
});