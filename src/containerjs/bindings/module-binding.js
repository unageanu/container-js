define( [
    "containerjs/bindings/binding",
    "containerjs/packaging-policy"
], function( Binding, PackagingPolicy ){
    
    "use strict";
    
    /** 
     * @class 
     * @name container.bindings.ModuleBinding
     * @extends {container.bindings.Binding.<X>}
     * 
     * @constructor
     * @param {{
     *     module : string,
     *     packagingPolicy : container.PackagingPolicy
     * }} arg
     */
    var ModuleBinding = function( arg ){
        
        /**
         * @type {string}
         */
        this.module = arg.module || undefined;
        
        /**
         * @type {container.PackagingPolicy}
         */
        this.packagingPolicy = arg.packagingPolicy || PackagingPolicy.DEFAULT;
        
    };
    ModuleBinding.prototype = Object.create( Binding.prototype );
    
    /**
     * @protected
     * @param {container.Loader}
     * @return {Deferred.<X,*>}
     */
    ModuleBinding.prototype.load = function(loader) {
        return this.packagingPolicy.retrieve( loader, 
            this.componentName(), this.module );
    };
    
    /**
     * @protected
     * @return {string}
     */
    ModuleBinding.prototype.componentName = function() {};
    
    
    Object.seal(ModuleBinding.prototype);
    return ModuleBinding;
});