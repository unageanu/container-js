define( [
    "containerjs/bindings/binding",
    "containerjs/utils/deferred"
], function( Binding, Deferred ){
    
    "use strict";
    
    /** 
     * @class 
     * @name container.bindings.InstanceBinding
     * @extends {container.bindings.Binding.<X>}
     * 
     * @constructor
     * @param {{
     *     instance : !X
     * }} arg
     */
    var InstanceBinding = function( arg ){
        
        Binding.call( this, arg );
        
        /**
         * @type {!X}
         */
        this.instance = arg.instance;
        
    };
    InstanceBinding.prototype = Object.create( Binding.prototype );
    
    /** @override */
    InstanceBinding.prototype.getInstance = function( container ) {
        return this.injectProperties( this.instance, container );
    };
    
    
    Object.freeze(InstanceBinding.prototype);
    return InstanceBinding;
});