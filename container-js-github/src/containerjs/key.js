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
                value : function( container ) {
                    var d = all ? container.gets( name ) : container.get( name );
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