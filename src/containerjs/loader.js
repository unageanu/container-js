
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
            var originalErrorHandler = require.onError;
            try {
                require.onError = function(e){
                    require.onError = originalErrorHandler;
                    d.reject(e);
                    if (originalErrorHandler) originalErrorHandler(e);
                };
                require( [moduleName], function( module ) {
                    d.resolve(module);
                    require.onError = originalErrorHandler;
                });
            } catch (e) {
                d.reject(e);
                require.onError = originalErrorHandler;
            }
            return d;
        }
    };
    
    return Object.freeze(RequireJsLoader);
});