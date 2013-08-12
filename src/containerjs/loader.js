
define( [
    "containerjs/utils/deferred"
], function( Deferred ){

    "use strict";
    
    /**
     * @interface 
     * @name {container.Loader}
     */
    var Loader = {};
    
    /**
     * @param {string} moduleName
     * @return {Deferred.<*,*>}
     */
    Loader.load = function( moduleName ) {};
    
    /** 
     * @class 
     * @implements {container.Loader}
     */
    var RequireJsLoader = {
        load : function( moduleName ) {
            var d = new Deferred();
            try {
                require( [moduleName], function( module ) {
                    d.resolve(module);
                }, function(e) {
                    d.reject(e);
                });
            } catch (e) {
                d.reject(e);
            }
            return d;
        }
    };
    
    return Object.freeze(RequireJsLoader);
});