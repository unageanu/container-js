define( [
    "containerjs/bindings/binding",
    "containerjs/bindings/module-binding",
    "containerjs/utils/asserts",
    "containerjs/utils/deferred"
], function( Binding, ModuleBinding, Asserts, Deferred ){
    
    "use strict";
    
    /** 
     * @class 
     * @name container.bindings.ObjectBinding
     * @extends {container.bindings.ModuleBinding.<X>}
     * 
     * @constructor
     * @param {{
     *     object : !string
     * }} arg
     */
    var ObjectBinding = function( arg ){ 
        
        Asserts.assertNotNull(arg.object, "object");
        
        Binding.call( this, arg );
        ModuleBinding.call( this, arg );
        
        /**
         * @type {!string}
         */
        this.object = arg.object;
        
    };
    ObjectBinding.prototype = Object.create( ModuleBinding.prototype );
    
    /** @override */
    ObjectBinding.prototype.getInstance = function( container, requestId ) {
        var d = new Deferred();
        var errorback = function( error ){ d.reject(error); }
        this.load(container.loader).then( function( component ) {
            this.injectProperties( component, container, requestId ).then( function( ){
                d.resolve(component);
            }, errorback ).fail( errorback );
        }.bind( this ), errorback).fail( errorback );
        return d;
    };
    
    /** @override */
    ObjectBinding.prototype.componentName = function() { 
        return this.object;
    };
    
    
    Object.freeze(ObjectBinding.prototype);
    return ObjectBinding;
});