define( [
    "containerjs/key"
], function( Key ){
    
    "use strict";
    
    /**
     * @param {String} name
     * @return {container.Key}
     */
    var Inject = function( name ) {
        return Key.create( name, false, false );
    };
    /**
     * @param {String} name
     * @return {container.Key}
     */
    Inject.lazily = function( name ) {
        return Key.create( name, false, true );
    };
    /**
     * @param {String} name
     * @return {container.Key}
     */
    Inject.all = function( name ) {
        return Key.create( name, true, false );
    };
    /**
     * @param {String} name
     * @return {container.Key}
     */
    Inject.all.lazily = function( name ) {
        return Key.create( name, true, true );
    };
    
    Object.freeze(Inject);
    return Inject;
});