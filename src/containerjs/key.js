define( [
    "containerjs/utils/deferred"         
], function( Deferred ){
    
    "use strict";
    
    /**
     * @interface 
     * @name container.Key
     * @template T
     */
    var Key = {
        /**
         * @param {container.Container}
         * @return {Deferred.<T,?>}
         */
        get : function( container ) {}
    };
    
    /**
     * @public
     * @template T
     * @param {string} name
     * @param {boolean} all
     * @param {boolean} lazily
     * @return {Key.<T>}
     */
    Key.create = function( name, all, lazily ) {
        return Object.freeze( Object.create( Key, {
            get : { 
                value : function( container, requestId ) {
                    requestId = lazily ? null : requestId;
                    var d = all 
                        ? container.gets( name, requestId ) 
                        : container.get( name, requestId );
                    if ( lazily ) {
                        return Deferred.valueOf( d );
                    } else {
                        return d;
                    }
                }
            }
        }));
    };
    
    
    Object.freeze(Key);    
    return Key;
});