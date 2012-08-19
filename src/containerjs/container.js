define([
    "containerjs/loader",
    "containerjs/binder",
    "containerjs/scope",
    "containerjs/utils/deferred"
], function( loader, Binder, scope, Deferred  ){
    
    "use strict";

    /**
     * @class container.Container
     * @constructor
     * @param {function(container.Binder):void} module 
     */
    var Container = function Container ( module ) {
        
        /** @type {Object.<string, Array.<container.Binding.<*>>>} */
        this.bindings;
        /** @type {Array.<container.Aspect>} */
        this.aspects;
        /** @type {Array.<{id:Number, name:string>} */
        this.creating = [];
        /** @type {Object.<string,*>} */
        this.singletonComponents = {};
        /** @type {container.Container} */
        this.chainedContainer = null;
        
        this.load(module, this);
        this.loader = loader;
        this.createEagerSingletonConponents(this);
        
        Object.seal(this);
    };
    var prototype = Container.prototype;
    
    /**
     * @public
     * @param {string} name
     * @return {Promise.<*,*>}
     */
    prototype.get = function( name ) {
        return Deferred.lazy( _get, this, arguments );
    };
    /** @private */
    var _get = function(name) {
        var binding = null;
        try {
           binding = this.getBinding(name);
        } catch ( e ) {
            return this.chainedContainer 
                ? this.chainedContainer.get(name)
                : Deferred.errorOf(e);
        }
        return binding.scope.retrievingStrategy( this, binding );
    };
    
    /**
     * @public
     * @param {string} name
     * @return {Promise.<Array.<*>,*>}
     */
    prototype.gets = function( name ) {
        return Deferred.lazy( _gets, this, arguments );
    };
    /** @private */
    var _gets = function(name) {
        var bindings = null;
        try {
            bindings = this.getBindings(name);
        } catch ( e ) {
            return this.chainedContainer 
                ? this.chainedContainer.gets(name)
                : Deferred.errorOf(e);
        }
        
        var deferreds = bindings.map( function (binding) {
            return binding.scope.retrievingStrategy( this, binding );
        }.bind(this));
        
        if (this.chainedContainer && this.chainedContainer.hasBindings(name)) {
            var d = new Deferred();
            var errorback = function(e){ d.reject(e); }
            Deferred.when( deferreds ).then( function(components){
                this.chainedContainer.gets(name).then(function( parentComponent ){
                    d.resolve(components.concat(parentComponent));
                }, errorback)
            }.bind(this), errorback);
            return d;
        } else {
            return Deferred.when( deferreds );
        }
    };
    
    /**
     * @public
     * @param {string} name
     * @return {container.Binding}
     */
    prototype.getBinding = function( name ) {
        return this.getBindings(name)[0];
    };

    /**
     * @public
     * @param {string} name
     * @return {Array.<container.Binding>}
     */
    prototype.getBindings = function( name ) {
        if ( this.hasBindings(name) ) {
            return this.bindings[name];
        } else {
            throw new Error( "component is not binded. name=" + name ); 
        }
    };
    
    /**
     * @public
     * @param {string} name
     * @return {boolean}
     */
    prototype.hasBindings = function( name ) {
        var defintions = this.bindings[name];
        return defintions && defintions.length > 0;
    };
    
    /**
     * @public
     */
    prototype.destroy = function() {
        for ( var name in this.bindings ) {
            this.bindings[name].forEach( function(binding){
                binding.scope.destructionStrategy( this, binding ); 
            }.bind(this));
            delete this.singletonComponents[name];
        }
    };
    
    /**
     * @public
     * @param {container.Container} container
     */
    prototype.chain = function( container ) {
        this.chainedContainer = container;
    };
    
    /** @private */
    prototype.createComponent = Deferred.defer( function( binding ) {
        this.checkCyclicDependency( binding );
        this.creating.push({id:binding.id, name:binding.name});
        
        return binding.getInstance( this ).pipe( function(component){
            try { 
                this.aspects.forEach(function(aspect){
                    component = aspect.weave( binding, component );
                });
                binding.initialize(component,this);
                return component;
            } finally {
                this.creating.pop();
            }
        }.bind(this), function(error) {
            this.creating.pop();
            return error;
        }.bind(this));
    });
    
    /** @private */
    prototype.checkCyclicDependency = function( binding ) {
        var result = this.creating.some( function(idAndName){
            return idAndName.id === binding.id;
        });
        if ( result ) {
            throw new Error("detect cyclic dependency.\n  -> " + 
                    this.creating.map(function(idAndName) {
                        return idAndName.name;
                    }).concat([binding.name]).join("\n  -> "));
        }
    };
    
    /** @private */
    prototype.load = function( module ) {
        var binder = new Binder();
        module.call( null, binder );
        this.bindings = binder.buildBindings();
        this.aspects = binder.buildAspects();
    };
    
    /** @private */
    prototype.createEagerSingletonConponents = function() {
        var f = function( binding ){
            if (binding.scope.createOnStartUp) {
                binding.scope.retrievingStrategy( this, binding );
            } 
        }.bind(this);
        for ( var i in this.bindings ) {
            this.bindings[i].forEach(f);
        }
    };

    Object.freeze(prototype);
    return Container;
});