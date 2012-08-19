define([
    "containerjs/utils/asserts",
    "containerjs/utils/deferred" 
], function( Asserts, Deferred ){
    
    "use strict";
    
    /**
     * @enum {{
     *   retrieve : function( container.Loader, string, string= ):Deferred.<*,*>
     * }}
     */
    var PackagingPolicy = {
        retrieve : Deferred.defer( function( loader, componentName, moduleName ) {
            Asserts.assertNotEmpty(componentName, "componentName");
            moduleName = moduleName || this.resolveModuleFor(componentName);
            Asserts.assertNotEmpty(moduleName, "moduleName");
            
            return loader.load( moduleName ).pipe( function( module ) {
                return (module && this.findComponent( module, componentName ))
                        || notFound( componentName, moduleName );
            }.bind( this ) );
        })
    };
    
    var policies = {};
    
    policies.MODULE_PER_PACKAGE = Object.freeze( Object.create( PackagingPolicy, function(){
        
        /** @private */
        var getComponentName = function( componentName ) {
            assertValidComponentName( componentName );
            return componentName.substring( 
                componentName.lastIndexOf(".")+1 );
        };
        /** @private */
        var getModuleName = function( componentName ) {
            assertValidComponentName( componentName );
            assertContainsPackage( componentName );
            return componentName.substring( 0, componentName.lastIndexOf(".") );
        };
        /** @private */
        var assertContainsPackage = function( componentName ) {
            var lastIndexOfPeriod = componentName.lastIndexOf(".");
            if ( lastIndexOfPeriod === -1 || lastIndexOfPeriod+1 >= componentName.length ) {
                throw new Error("componentName does not contain a package.");
            }
        };
        /** @private */
        var assertValidComponentName = function( componentName ) {
            if ( /^\\.+$/.test( componentName ) ) {
                throw new Error("invalid component name. componentName=" + String(componentName));
            }
        };
        return {
            /** @private */
            resolveModuleFor : {
                value : function( componentName ) {
                    return convertToModuleName(getModuleName(componentName));
                }
            },
            /** @private */
            findComponent : {
                value : function( module, componentName ) {
                    return module[getComponentName(componentName)];
                }
            }
        };
    }()));
    
    policies.MODULE_PER_CLASS = Object.freeze( Object.create( PackagingPolicy,{
        /** @private */
        resolveModuleFor : {
            value : function( componentName ) {
                return convertToModuleName(componentName);
            }
        },
        /** @private */
        findComponent : {
            value : function( module, componentName ) {
                return module;
            }
        }
    }));
    
    policies.SINGLE_FILE = Object.freeze( Object.create( PackagingPolicy, {
        /** @private */
        resolveModuleFor : {
            value : function( componentName ) {
                return convertToModuleName(componentName.split(".")[0]);
            }
        },
        /** @private */
        findComponent : {
            value : function( module, componentName ) {
                var steps = componentName.split(".");
                var m = module;
                for ( var i=1;i<steps.length && m ;i++ ) {
                    m = m[steps[i]];
                }
                return m;
            }
        }
    }));
    
    policies.DEFAULT = policies.MODULE_PER_CLASS;
    
    /** @private */
    var convertToModuleName = function( name ) {
        return name.replace(/\./g, "/")
                    .replace(/([a-z])(?=[A-Z])/g, "$1-")
                    .toLowerCase();
    };
    /** @private */
    var notFound = function(componentName,moduleName) {
        throw new Error("componenet '"+ componentName + 
                "' is not found in module '" + moduleName + "'.");
    };
    
    return Object.freeze(policies);
});