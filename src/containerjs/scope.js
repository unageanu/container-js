define([
    "containerjs/utils/deferred"
], function(Deferred){
    
    "use strict";
    
    var retrievingStrategies = {
        forSingleton : function( container, binding, parentId ) {
            return container.singletonComponents[binding.id]
                || (container.singletonComponents[binding.id]
                       = container.createComponent(binding, parentId));
        },
        forPrototype : function( container, binding, parentId ) {
            return container.createComponent(binding, parentId);
        }
    };
    var destructionStrategies = {
        destroyIfComponentExist : function( container, binding ) {
            var component = container.singletonComponents[binding.id];
            if ( component ) {
                Deferred.unpack( component.then(function(c){
                    binding.destroy( c, container );
                }));
            }
        },
        nothingToDo : function( container, binding ) {}
    };
    
    /**
     * @enum {{
     *   retrievingStrategy : 
     *      function( container.bindings.Binding.<*>, container.Container, number? ):*,
     *   destructionStrategy : 
     *      function( container.bindings.Binding.<*>, container.Container ):*,
     *   createOnStartUp : boolean
     * }}
     */
    var Scope = {
        SINGLETON : Object.freeze({
            retrievingStrategy : retrievingStrategies.forSingleton,
            destructionStrategy : destructionStrategies.destroyIfComponentExist,
            createOnStartUp : false
        }),
        EAGER_SINGLETON : Object.freeze({
            retrievingStrategy : retrievingStrategies.forSingleton,
            destructionStrategy : destructionStrategies.destroyIfComponentExist,
            createOnStartUp : true
        }),
        PROTOTYPE : Object.freeze({
            retrievingStrategy : retrievingStrategies.forPrototype,
            destructionStrategy : destructionStrategies.nothingToDo,
            createOnStartUp : false
        })
    };
    return Object.freeze(Scope);
    
});