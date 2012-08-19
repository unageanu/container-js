define(function(){
    
    "use strict";
    
    /**
     * @class
     */
    var Component = function() {};
    
    Component.prototype.method1 = function(  ) {
        print("method1 : executed.");
    };
    Component.prototype.method2 = function(  ) {
        print("method2 : executed.");
    };
    return Component;
});