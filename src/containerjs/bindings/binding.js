define( [
    "containerjs/inject",
    "containerjs/key",
    "containerjs/scope",
    "containerjs/utils/asserts",
    "containerjs/utils/deferred"
], function( Inject, Key, Scope, Asserts, Deferred ){
    
    "use strict";
    
    /**
     * @typedef {(container.Key|container.Inject|*)}
     * @name container.bindings.Value
     */
    var Value;
    
    /** 
     * @class
     * @name container.bindings.Binding
     * @template <X> the bound type.
     * 
     * @constructor
     * @param {{
     *     id : !number,
     *     name : !string,
     *     scope : container.Scope,
     *     injectionProperties : Object.<string,container.bindings.Value>
     * }} arg
     */
    var Binding = function( arg ){
        
        Asserts.assertNotNull(arg.id, "id");
        Asserts.assertNotEmpty(arg.name, "name");
        
        /**
         * @type {!number}
         */
        this.id = arg.id;
        
        /**
         * @type {!string}
         */
        this.name = arg.name;
        
        /**
         * @type {container.Scope}
         */
        this.scope = arg.scope || Scope.SINGLETON;
        
        /**
         * @type {Object.<string,container.bindings.Value>}
         */
        this.injectionProperties = arg.injectionProperties || {};
        
        /**
         * @type {function( X, container.Container ):void}
         */
        this.initializer = undefined;
        
        /**
         * @type {function( X, container.Container ):void}
         */
        this.destructor = undefined;
    };
    
    /**
     * @param {container.Container} container
     * @return {Deferred.<X>}
     */
    Binding.prototype.getInstance = function( container ){};
    
    /** 
     * @param {X} component
     * @param {container.Container} container 
     */
    Binding.prototype.initialize = function( component, container ) {
        if (this.initializer) this.initializer( component, container );
    };
    
    /** 
     * @param {X} component
     * @param {container.Container} container 
     */
    Binding.prototype.destroy = function( component, container ) {
        if (this.destructor) this.destructor( component, container );
    };
    
    /** 
     * @private
     * @param {X} component
     * @param {container.Container} container
     * @return {Deferred.<X,?>}
     */
    Binding.prototype.injectProperties = function( component, container ) {
        var injectionProperties = this.collectInjectionProperties( component );
        return this.resolveProperties( 
            injectionProperties, container 
        ).pipe( function( values ){
            for ( var i in values ) {
                if ( !values.hasOwnProperty(i) ) { 
                    continue; 
                }
                component[i] = values[i];
            }
            return component;
        }.bind(this));
    };
    
    /** @private */
    Binding.prototype.collectInjectionProperties = function( component ){
        var injectionProperties = {};
        this.collectFromModuleDefinition(injectionProperties, this.injectionProperties);
        this.collectFromComponent(injectionProperties, component);
        return injectionProperties;
    };
    
    /** @private */
    Binding.prototype.collectFromModuleDefinition = function(injectionProperties, definedInjectionProperties) {
        for ( var i in definedInjectionProperties ) {
            if ( !definedInjectionProperties.hasOwnProperty(i) ) { 
                continue; 
            }
            injectionProperties[i] = definedInjectionProperties[i];
        }
    };
    
    /** @private */
    Binding.prototype.collectFromComponent = function(injectionProperties, component) {
        for ( var i in component ) {
            var value = component[i];
            if ( !this.isInjectionProperty( value ) ) { 
                continue; 
            }
            injectionProperties[i] = value;
        }
    };
    
    /** @private */
    Binding.prototype.isInjectionProperty = function( value ) {
        if ( value && Key.isPrototypeOf( value ) ) {
            return true;
        } else if ( value === Inject
                ||   value === Inject.all
                ||   value === Inject.lazily
                ||   value === Inject.all.lazily) {
            return true;
        } else {
            return false;
        }
    };
    
    /** @private */
    Binding.prototype.resolveProperty = function( value, container, name ) {
        if ( value && Key.isPrototypeOf( value ) ) {
            return value.get( container );
        } else if ( value === Inject
                ||   value === Inject.all
                ||   value === Inject.lazily
                ||   value === Inject.all.lazily) {
            Asserts.assertNotNull( name, "name" );
            return value(name).get( container );
        } else {
            return Deferred.valueOf( value );
        }
    };
    
    /** @private */
    Binding.prototype.resolveProperties = function( collection, container, valueKey ) {
        var deferreds = [];
        if ( !collection ) return Deferred.valueOf(collection);
        if ( collection.forEach ) {
            collection.forEach( function ( value ){
                deferreds.push( this.resolveProperty( value, container ));
            });
            return Deferred.wait( deferreds );
        } else {
            var keys = [];
            for ( var i in collection ) {
                if ( !collection.hasOwnProperty(i) ) { 
                    continue; 
                }
                keys.push(i);
                var value = valueKey ? collection[i][valueKey] : collection[i];
                deferreds.push( this.resolveProperty( value, container, i ));
            }
            return Deferred.when( deferreds ).pipe( function( array ){
                var tmp = {};
                for ( var i=0;i<keys.length; i++ ) {
                    var key = keys[i];
                    if ( valueKey ) {
                        collection[key][valueKey] = array[i];
                        tmp[key] = collection[key];
                    } else {
                        tmp[key] = array[i];
                    }
                }
                return tmp;
            });
        }
    };
    
    Object.seal(Binding.prototype);
    return Binding;
});