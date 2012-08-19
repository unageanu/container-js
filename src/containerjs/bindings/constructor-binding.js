define( [
    "containerjs/bindings/binding",
    "containerjs/bindings/module-binding",
    "containerjs/utils/asserts",
    "containerjs/utils/deferred"
], function( Binding, ModuleBinding, Asserts, Deferred ){
    
    "use strict";
    
    /** 
     * @class 
     * @name container.bindings.ConstructorBinding
     * @extends {container.bindings.ModuleBinding.<X>}
     * 
     * @constructor
     * @param {{
     *     constructor : !string,
     *     constructorArgument : Object.<string, container.bindings.Value>
     * }} arg
     */
    var ConstructorBinding = function( arg ){ 
        
        Asserts.assertNotNull(arg.constructor, "constructor");
        
        Binding.call( this, arg );
        ModuleBinding.call( this, arg );
        
        /**
         * @type {!string}
         */
        this.constructor = arg.constructor;
        
        /**
         * @type {Object.<string, container.bindings.Value>}
         */
        this.constructorArgument = arg.constructorArgument || undefined;
        
    };
    ConstructorBinding.prototype = Object.create( ModuleBinding.prototype );
    
    /** @override */
    ConstructorBinding.prototype.getInstance = function( container ) {
        var d = new Deferred();
        var errorback = function( error ){ d.reject(error); };
        this.load(container.loader).then( function( constructor ) {
            this.resolveProperties(this.constructorArgument, container).then( function(constructorArgument){
                var component = new constructor( constructorArgument );
                this.injectProperties( component, container ).then( function( ){
                    d.resolve(component);
                }, errorback ).fail( errorback );
            }.bind( this ), errorback).fail( errorback );
        }.bind( this ), errorback).fail( errorback );
        return d;
    };
    
    /** @override */
    ConstructorBinding.prototype.componentName = function() { 
        return this.constructor;
    };
    
    
    Object.freeze(ConstructorBinding.prototype);
    return ConstructorBinding;
});