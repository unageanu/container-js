define( [
    "containerjs/bindings/prototype-binding",
    "containerjs/bindings/constructor-binding",
    "containerjs/bindings/object-binding",
    "containerjs/bindings/instance-binding",
    "containerjs/bindings/provider-binding"
], function( PrototypeBinding, ConstructorBinding, ObjectBinding, InstanceBinding, ProviderBinding ){
    
    "use strict";
    
    /** 
     * @interface
     */
    var BindingFactory = {
        
        /**
         * @template <X>
         * @param {{
         *     name : !string,
         *     prototype : !string,
         *     prototypeProperties : Object.<string, {value : container.bindings.Value}>,
         *     scope : container.Scope,
         *     injectionProperties : Object.<string,container.bindings.Value>
         * }} arg
         * @return PrototypeBinding.<X>
         */
        createPrototypeBinding : function( arg ){},

        /**
         * @template <X>
         * @param {{
         *     name : !string,
         *     constructor : !string,
         *     constructorArgument : Object.<string, container.bindings.Value>,
         *     scope : container.Scope,
         *     injectionProperties : Object.<string,container.bindings.Value>
         * }} arg
         * @return PrototypeBinding.<X>
         */
        createConstructorBinding : function( arg ){},
        
        /**
         * @template <X>
         * @param {{
         *     name : !string,
         *     object : !string,
         *     scope : container.Scope,
         *     injectionProperties : Object.<string,container.bindings.Value>
         * }} arg
         * @return ObjectBinding.<X>
         */
        createObjectBinding : function( arg ){},
        
        /**
         * @template <X>
         * @param {{
         *     name : !string,
         *     instance : !X,
         *     scope : container.Scope,
         *     injectionProperties : Object.<string,container.bindings.Value>
         * }} arg
         * @return PrototypeBinding.<X>
         */
        createInstanceBinding : function( arg ){},
        
        /**
         * @template <X>
         * @param {{
         *     name : !string,
         *     provider : !function(container.Container):X,
         *     scope : container.Scope,
         *     injectionProperties : Object.<string,container.bindings.Value>
         * }} arg
         * @return PrototypeBinding.<X>
         */
        createPrvoiderBinding : function( arg ){}
    };
    
    var generateFactoryMethod = function( BindingClass ) {
        return { 
            value : function( arg ) {
                arg.id = this.serial++;
                return Object.seal(new BindingClass(arg));
            }
        };
    };
    var BindingFactoryImpl = Object.seal( Object.create( BindingFactory, {
        
        /** @override */
        createPrototypeBinding   : generateFactoryMethod( PrototypeBinding ),
        /** @override */
        createConstructorBinding : generateFactoryMethod( ConstructorBinding ),
        /** @override */
        createObjectBinding      : generateFactoryMethod( ObjectBinding ),
        /** @override */
        createInstanceBinding    : generateFactoryMethod( InstanceBinding ),
        /** @override */
        createProviderBinding    : generateFactoryMethod( ProviderBinding ),
        
        /** @private */
        serial : {
            value : 0,
            writable: true
        }
    
    }));
    
    return BindingFactoryImpl;
});