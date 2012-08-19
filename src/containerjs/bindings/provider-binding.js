define( [
    "containerjs/bindings/binding",
    "containerjs/utils/deferred",
    "containerjs/utils/asserts"
], function( Binding, Deferred, Asserts ){
    
    "use strict";
    
    /** 
     * @class 
     * @name container.bindings.ProviderBinding
     * @extends {container.bindings.Binding.<X>}
     * 
     * @constructor
     * @param {{
     *     provider : !function(container.Container):X
     * }} arg
     */
    var ProviderBinding = function( arg ){
        
        Asserts.assertValueIsFunction( arg.provider, "provider" );
        
        Binding.call( this, arg );
        
        /**
         * @type {!function(container.Container):X}
         */
        this.provider = arg.provider;
        
    };
    ProviderBinding.prototype = Object.create( Binding.prototype );
    
    /** @override */
    ProviderBinding.prototype.getInstance = function( container ) {
        return this.injectProperties( this.provider( container ), container );
    };
    
    
    Object.freeze(ProviderBinding.prototype);
    return ProviderBinding;
});