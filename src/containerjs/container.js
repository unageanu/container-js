define([
    "containerjs/loader",
    "containerjs/binder",
    "containerjs/scope",
    "containerjs/utils/deferred"
], function( loader, Binder, scope, Deferred ){
    
    "use strict";

    /**
     * @class container.Container
     * @constructor
     * @param {function(container.Binder):void} module 
     * @param {container.PackagingPolicy?} defaultPackagingPolicy
     */
    var Container = function Container ( module, defaultPackagingPolicy ) {
        
        /** @type {Object.<string, Array.<container.Binding.<*>>>} */
        this.bindings = null;
        /** @type {Array.<container.Aspect>} */
        this.aspects = null;
        /** @type {Object.<number, {id:Number, name:string, parentId:number>} */
        this.creating = {};
        /** @type {Object.<string,*>} */
        this.singletonComponents = {};
        /** @type {container.Container} */
        this.chainedContainer = null;

        this.createRequestSerial = 1;
        
        this.load(module, defaultPackagingPolicy);
        this.loader = loader;
        this.onEagerSingletonConponentsInitialized =
            this.createEagerSingletonConponents(this);
        
        Object.seal(this);
    };
    var prototype = Container.prototype;
    
    /**
     * @public
     * @param {string} name
     * @param {number?} parentId
     * @return {Promise.<*,*>}
     */
    prototype.get = function( name, parentId ) {
        return Deferred.lazy( _get, this, arguments );
    };
    /** @private */
    var _get = function(name, parentId) {
        var binding = null;
        try {
           binding = this.getBinding(name);
        } catch ( e ) {
            return this.chainedContainer 
                ? this.chainedContainer.get(name)
                : Deferred.errorOf(e);
        }
        try {
            this.checkCyclicDependency( binding, parentId );
        } catch (e) {
            return Deferred.errorOf( e );
        }
        return binding.scope.retrievingStrategy( this, binding, parentId );
    };
    
    /**
     * @public
     * @param {string} name
     * @param {number?} parentId
     * @return {Promise.<Array.<*>,*>}
     */
    prototype.gets = function( name, parentId ) {
        return Deferred.lazy( _gets, this, arguments );
    };
    /** @private */
    var _gets = function(name, parentId) {
        var bindings = null;
        try {
            bindings = this.getBindings(name);
        } catch ( e ) {
            return this.chainedContainer 
                ? this.chainedContainer.gets(name)
                : Deferred.errorOf(e);
        }
        
        var deferreds = null;
        try {
            deferreds = bindings.map( function (binding) {
                this.checkCyclicDependency( binding, parentId );
                return binding.scope.retrievingStrategy( this, binding, parentId );
            }.bind(this));
        } catch (e) {
            return Deferred.errorOf( e );
        }
        
        if (this.chainedContainer && this.chainedContainer.hasBindings(name)) {
            var d = new Deferred();
            var errorback = function(e){ d.reject(e); };
            Deferred.when( deferreds ).then( function(components){
                this.chainedContainer.gets(name).then(function( parentComponent ){
                    d.resolve(components.concat(parentComponent));
                }, errorback);
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
        var destructor = function(binding){
            binding.scope.destructionStrategy( this, binding ); 
        }.bind(this);
        for ( var name in this.bindings ) {
            this.bindings[name].forEach(destructor);
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
    prototype.createComponent = Deferred.defer( function( binding, parentId ) {

        var requestId = this.createRequestSerial++;
        this.creating[requestId] = {id:binding.id, name:binding.name, parentId:parentId};
        
        return binding.getInstance( this, requestId ).pipe( function(component){
            try { 
                this.aspects.forEach(function(aspect){
                    component = aspect.weave( binding, component );
                });
                binding.initialize(component, this);
                return component;
            } finally {
                delete this.creating[requestId];
            }
        }.bind(this), function(error) {
            delete this.creating[requestId];
            return error;
        }.bind(this));
    });
    
    /** @private */
    prototype.checkCyclicDependency = function( binding, parentId ) {
        var paths = [binding.name];
        while( parentId ) {
            paths.unshift( this.creating[parentId].name );
            if (this.creating[parentId].id === binding.id) {
                throw new Error("detect cyclic dependency.\n  -> " + 
                        paths.join("\n  -> "));
            }
            parentId = this.creating[parentId].parentId;
        }
    };
    
    /** @private */
    prototype.load = function( module, defaultPackagingPolicy ) {
        var binder = new Binder(defaultPackagingPolicy);
        module.call( null, binder );
        this.bindings = binder.buildBindings();
        this.aspects = binder.buildAspects();
    };
    
    /** @private */
    prototype.createEagerSingletonConponents = function() {
        var f = function( binding ){
            if (binding.scope.createOnStartUp) {
                return binding.scope.retrievingStrategy( this, binding );
            } else {
                return null;
            }
        }.bind(this);
        var deferreds = [];
        var notNull = function(x) { 
            return x != null;
        };
        for ( var i in this.bindings ) {
            deferreds = deferreds.concat(this.bindings[i].map(f).filter(notNull));
        }
        return Deferred.when(deferreds);
    };

    Object.freeze(prototype);
    return Container;
});