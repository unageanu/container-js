define([
    "containerjs/bindings/binding-factory"      
], function( bindingFactory ){

    "use strict";
    
    /**
     * @class
     */
    var LinkBuilder = {
        
        /**
         * @param {!string} constructor
         * @return {( conteiner.bindingBuilders.OptionalSettingBuilder|conteiner.bindingBuilders.ConstructorArgumentBuilder|conteiner.bindingBuilders.ModuleMappingBuilder )}
         */
        to : function( constructor ) {
            this.reference.set( bindingFactory.createConstructorBinding( {
                name : this.reference.get().name,
                constructor : constructor,
                packagingPolicy : this.reference.get().packagingPolicy
            }));
            return createBuilder( ConstructorComponentBuilder, this.reference );
        },
        
        /**
         * @param {!string} prototype
         * @param {Object.<string, {
         *      value:container.bindings.Value,
         *      writable:boolean,
         *      enumerable:boolean,
         *      configurable:boolean,
         *      get:function():*,
         *      set:function(*):void
         * }>=} prototypeProperties
         * @return {(conteiner.bindingBuilders.OptionalSettingBuilder|conteiner.bindingBuilders.ModuleMappingBuilder )}
         */
        toPrototype : function( prototype, prototypeProperties ) {
            this.reference.set( bindingFactory.createPrototypeBinding( {
                name : this.reference.get().name,
                prototype : prototype,
                prototypeProperties : prototypeProperties,
                packagingPolicy : this.reference.get().packagingPolicy
            }));
            return createBuilder( ModuleAndOptionalSettingBuilder, this.reference );
        },
        
        /**
         * @param {Object.<string, {
         *      value:container.bindings.Value,
         *      writable:boolean,
         *      enumerable:boolean,
         *      configurable:boolean,
         *      get:function():*,
         *      set:function(*):void
         * }>=} prototypeProperties
         * @return {(conteiner.bindingBuilders.OptionalSettingBuilder|conteiner.bindingBuilders.ModuleMappingBuilder )}
         */
        asPrototype : function( prototypeProperties ) {
            this.reference.set( bindingFactory.createPrototypeBinding( {
                name : this.reference.get().name,
                prototype : this.reference.get().name,
                prototypeProperties : prototypeProperties,
                packagingPolicy : this.reference.get().packagingPolicy
            }));
            return createBuilder( ModuleAndOptionalSettingBuilder, this.reference );
        },
        
        /**
         * @param {!string} object
         * @return {(conteiner.bindingBuilders.OptionalSettingBuilder|conteiner.bindingBuilders.ModuleMappingBuilder )}
         */
        toObject : function( object ) {
            this.reference.set( bindingFactory.createObjectBinding( {
                name : this.reference.get().name,
                object : object,
                packagingPolicy : this.reference.get().packagingPolicy
            }));
            return createBuilder( ModuleAndOptionalSettingBuilder, this.reference );
        },
        
        /**
         * @return {(conteiner.bindingBuilders.OptionalSettingBuilder|conteiner.bindingBuilders.ModuleMappingBuilder )}
         */
        asObject : function() {
            this.reference.set( bindingFactory.createObjectBinding( {
                name : this.reference.get().name,
                object : this.reference.get().name,
                packagingPolicy : this.reference.get().packagingPolicy
            }));
            return createBuilder( ModuleAndOptionalSettingBuilder, this.reference );
        },
        
        /**
         * @param {!X} instance
         * @return {conteiner.bindingBuilders.OptionalSettingBuilder}
         */
        toInstance : function( instance ) {
            this.reference.set( bindingFactory.createInstanceBinding( {
                name : this.reference.get().name,
                instance : instance
            }));
            return createBuilder( OptionalSettingBuilder, this.reference );
        },
        
        /**
         * @param {!function(container.Container):X} provider
         * @return {conteiner.bindingBuilders.OptionalSettingBuilder}
         */
        toProvider : function( provider ) {
            this.reference.set( bindingFactory.createProviderBinding( {
                name : this.reference.get().name,
                provider : provider
            }));
            return createBuilder( OptionalSettingBuilder, this.reference );
        }
    };
    
    /**
     * @class
     */
    var ConstructorArgumentBuilder = {
        
        /**
         * @param {*} constructorArgument
         * @return {(conteiner.bindingBuilders.OptionalSettingBuilder
         *     | conteiner.bindingBuilders.ModuleMappingBuilder )}
         */
        withConstructorArgument : function( constructorArgument ) {
            this.reference.get().constructorArgument = constructorArgument;
            return createBuilder( ModuleAndOptionalSettingBuilder, this.reference );
        }
    };
    
    /**
     * @class
     */
    var ModuleMappingBuilder = {
        
        /**
         * @param {string} module
         * @return {conteiner.bindingBuilders.OptionalSettingBuilder}
         */
        loadFrom : function( module, packagingPolicy ) {
            this.reference.get().module = module;
            return this;
        },
        
        /**
         * @param {container.PackagingPolicy} packagingPolicy
         * @return {conteiner.bindingBuilders.OptionalSettingBuilder}
         */
        assign : function( packagingPolicy ) {
            if (packagingPolicy) {
                this.reference.get().packagingPolicy = packagingPolicy;
            }
            return this;
        }
    };
    
    /**
     * @class
     */
    var OptionalSettingBuilder = {    
            
        /**
         * @param {Object.<string,*>} properties
         * @return {conteiner.bindingBuilders.OptionalSettingBuilder}
         */
        withProperties : function( properties ) {
            this.reference.get().injectionProperties = properties;
            return this;
        },
        
        /**
         * @param {(string|function(X):void)} methodNameOrFunction
         * @return {conteiner.bindingBuilders.OptionalSettingBuilder}
         */
        onInitialize : function( methodNameOrFunction ) {
            this.reference.get().initializer = 
                createHandler( methodNameOrFunction);
            return this;
        },
        /**
         * @param {(string|function(X):void)} methodNameOrFunction
         * @return {conteiner.bindingBuilders.OptionalSettingBuilder}
         */
        onDestroy : function( methodNameOrFunction ) {
            this.reference.get().destructor = 
                createHandler( methodNameOrFunction);
            return this;
        },
        /**
         * @param {container.Scope} scope
         * @return {conteiner.bindingBuilders.OptionalSettingBuilder}
         */
        inScope : function( scope ) {
            this.reference.get().scope = scope;
            return this;
        }
        
    };
    
    /** @private */
    var createHandler  = function(methodNameOrFunction) {
        if ( typeof methodNameOrFunction === "string" ) {
            return function( component, container ) { 
                component[methodNameOrFunction](component);
            };
        } else {
            return function( component, container ) { 
                methodNameOrFunction.call(null, component); 
            };
        }
    };
    
    /** @private */
    var createBuilder = function(type, reference) {
        return Object.freeze( Object.create( type, {
            reference : {
                value : reference
            }
        }));
    };
    
    /** @private */
    var merge = function() {
        var obj = {};
        for ( var i=0,n=arguments.length; i<n; i++ ) {
            var src = arguments[i];
            for (var j in src) obj[j] = src[j];
        }
        return obj;
    };
    
    var ModuleAndOptionalSettingBuilder = merge( 
        OptionalSettingBuilder,
        ModuleMappingBuilder );
    
    var ConstructorComponentBuilder = merge( 
        ConstructorArgumentBuilder, 
        ModuleAndOptionalSettingBuilder );
    
    var RootBuilder = merge( 
        LinkBuilder, 
        ConstructorComponentBuilder );
    
    Object.freeze(LinkBuilder);
    Object.freeze(ConstructorArgumentBuilder);
    Object.freeze(OptionalSettingBuilder);
    Object.freeze(ModuleMappingBuilder);
    
    Object.freeze(RootBuilder);
    Object.freeze(ConstructorComponentBuilder);
    Object.freeze(ModuleAndOptionalSettingBuilder);
    
    return {
        RootBuilder : RootBuilder
    };
});