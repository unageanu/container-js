define( [
    "containerjs/bindings/binding",
    "containerjs/bindings/module-binding",
    "containerjs/utils/asserts",
    "containerjs/utils/deferred"
], function( Binding, ModuleBinding, Asserts, Deferred ){
    
    "use strict";
    
    /** 
     * @class 
     * @name container.bindings.PrototypeBinding
     * @extends {container.bindings.ModuleBinding.<X>}
     * 
     * @constructor
     * @param {{
     *     prototype : !string,
     *     prototypeProperties : Object.<string, {value : container.bindings.Value}>
     * }} arg
     */
    var PrototypeBinding = function( arg ){ 
        
        Asserts.assertNotNull(arg.prototype, "prototype");
        
        Binding.call( this, arg );
        ModuleBinding.call( this, arg );
        
        /**
         * @type {!string}
         */
        this.prototype = arg.prototype;
        
        /**
         * @type {Object.<string, {value : container.bindings.Value}>}
         */
        this.prototypeProperties = arg.prototypeProperties || undefined;
        
    };
    PrototypeBinding.prototype = Object.create( ModuleBinding.prototype );
        
    /** @override */
    PrototypeBinding.prototype.getInstance = function( container, requestId ) {
        var d = new Deferred();
        var errorback = function( error ){ d.reject(error); };
        this.load(container.loader).then( function( prototype ) {
            this.resolveProperties( this.prototypeProperties, container, "value", requestId ).then( function(prototypeProperties){
                var component = Object.create( prototype, prototypeProperties );
                this.injectProperties( component, container, requestId ).then( function( ){
                    d.resolve(component);
                }, errorback ).fail( errorback );
            }.bind( this ), errorback).fail( errorback );
        }.bind( this ), errorback).fail( errorback );
        return d;
    };
    
    /** @override */
    PrototypeBinding.prototype.componentName = function() { 
        return this.prototype;
    };
    
    /** @private */
    PrototypeBinding.prototype.resolvePrototypeProperties = function( collection, container ) {
        var tmp = {};
        for ( var i in collection ){
            tmp[i] = this.resolve( collection[i].value, container, i );
        }
        return tmp;
    };
    
    
    Object.freeze(PrototypeBinding.prototype);
    return PrototypeBinding;
});