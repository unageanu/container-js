define([
    "composing/modules"
], function( modules ) {
    
    "use strict";
    
    return function( binder ) {
        
        binder.bind("test.mock.models.TimeSource").to("timeSource");
        
        modules(binder);
    };
});