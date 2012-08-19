define( [
    "containerjs/scope",
    "containerjs/bindings/binding-factory",
    "containerjs/binding-builders",
    "containerjs/packaging-policy",
    "containerjs/aspect"
], function( scope, bindingFactory, bindingBuilders, PackagingPolicy, Aspect ){

    "use strict";
    
    /** @private */
    var Reference;
    
    /**
     * @class
     */
    var Binder = function () {
        this.bindings = {};
        this.aspects = [];
        this.defaultPackagingPolicy = PackagingPolicy.DEFAULT;
        
        Object.freeze(this);
    };
    var prototype = Binder.prototype;
    
    /**
     * @public 
     * @param {string} name
     * @return {(conteiner.bindingBuilders.LinkBuilder
     *            |conteiner.bindingBuilders.ConstructorArgumentBuilder
     *            |conteiner.bindingBuilders.OptionalSettingBuilder)}
     */
    prototype.bind = function( name ){
        var bindings = this.getBindingsFor(name);
        var reference = Object.freeze( Object.create( Reference, {
            bindings : { value : bindings },
            index : { value : bindings.length }
        }));
        reference.set( bindingFactory.createConstructorBinding({
            name : name ,
            constructor : name,
            packagingPolicy : this.defaultPackagingPolicy
        }));
        return Object.freeze( Object.create( 
            bindingBuilders.RootBuilder, {
                reference: { value : reference }
            }));
    };
    
    /**
     * @public 
     * @param {container.Aspect.Interceptor.<*,*>} interceptor
     * @param {container.Aspect.MethodMatcher.<*>} methodMatcher
     */
    prototype.bindInterceptor = function( interceptor, methodMatcher ){
        this.aspects.push(new Aspect(interceptor, methodMatcher));
    };
    
    /**
     * @public 
     */
    prototype.setDefaultPackagingPolicy = function( packagingPolicy ){
        this.defaultPackagingPolicy = packagingPolicy;
        return this;
    };
    
    /** @private */
    prototype.buildBindings = function( ){
        var j,i,n;
        for ( i in this.bindings ) {
            if ( !this.bindings.hasOwnProperty(i) ) { 
                continue; 
            }
            var array = this.bindings[i];
            for ( j=0,n=array.length;j<n;j++ ) {
                Object.freeze( array[j] );
            }
        }
        return this.bindings;
    };
    
    /** @private */
    prototype.buildAspects = function( ){
        return this.aspects;
    };
    
    /** @private */
    prototype.getBindingsFor = function ( name ) {
        return this.bindings[name]
            || (this.bindings[name] = []);
    };
    
    /** @private */
    Reference = {
        index : -1,
        bindings : [],
        set : function( binding ) {
            this.bindings[this.index] = binding;
        },
        get : function() {
            return this.bindings[this.index];
        }
    };
    
    Object.freeze(Binder.prototype);
    return Binder;
});