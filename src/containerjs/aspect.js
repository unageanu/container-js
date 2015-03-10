define( function(){

    "use strict";
    
    /**
     * @typedef {function(container.Aspect.JointPoint.<X, Y>):X}
     * @template <X> the component type.
     * @template <Y> the return type.
     * @name container.Aspect.Interceptor.<X,Y>
     */
    var Interceptor;
    
    /**
     * @typedef {function(container.Binding.<X>,X,string):boolean}
     * @template <X> the component type.
     * @name container.Aspect.MethodMatcher.<X>
     */
    var MethodMatcher;
    
    /**
     * @typedef {{
     *     self : X,
     *     methodName : string, 
     *     proceed : function():Y,
     *     arguments : Array.<*>,
     *     context : Object.<*,*>
     * }}
     * @template <X> the component type.
     * @template <Y> the return type.
     * @name container.Aspect.JointPoint.<X, Y>
     */
    var JointPoint;
    
    /**
     * @class
     * @name container.Aspect
     * 
     * @param {container.Aspect.Interceptor.<*,*>} interceptor
     * @param {container.Aspect.MethodMatcher.<*>} methodMatcher
     */
    var Aspect = function ( interceptor, methodMatcher ) {
        this.interceptor = interceptor;
        this.matcher = methodMatcher;
        Object.freeze(this);
    };
    var prototype = Aspect.prototype;
    
    /**
     * @public
     * @template <X> the component type.
     * @param {container.Binding.<X>} binding
     * @param {X} component
     */
    prototype.weave = function( binding, component ) {
        var prototypeObject = this.isEnhancedObject(component)
            ? Object.getPrototypeOf(component) : component;
        var enhancedMethods = {};
        if ( this.collectAndCreateEnhancedMethod(
                binding, component, prototypeObject, enhancedMethods) ) {
            enhancedMethods[ENHANCED_FLAG] = {value:true};
            return Object.create( component, enhancedMethods );
        } else {
            return component;
        }
    };
    
    /** @private */
    prototype.collectAndCreateEnhancedMethod = function( 
            binding, component, prototypeObject, enhancedMethods ) {
        var enhanced = this.collectFromEnumerableProperties( 
                binding, component, prototypeObject, enhancedMethods );
        return this.collectFromNonEnumerableProperties(
                binding, component, prototypeObject, enhancedMethods ) || enhanced;
    };
    
    /** @private */
    prototype.collectFromEnumerableProperties = function( 
            binding, component, prototypeObject, enhancedMethods ) {
        var enhanced = false;
        for ( var name in prototypeObject ){
            enhanced = this.checkAndCreateEnhancedMethod(
                    binding, component, enhancedMethods, name) || enhanced;
        }
        return enhanced;
    };
    
    /** @private */
    prototype.collectFromNonEnumerableProperties = function( 
            binding, component, prototypeObject, enhancedMethods ) {
        var enhanced = false; 
        Object.getOwnPropertyNames(prototypeObject).forEach( function(name){
            if (Object.getOwnPropertyDescriptor(prototypeObject, name).enumerable) {
                return;
            }
            enhanced = this.checkAndCreateEnhancedMethod(
                    binding, component, enhancedMethods, name) || enhanced;
        }.bind(this));
        var proto = Object.getPrototypeOf(prototypeObject);
        if ( proto ) {
            enhanced = this.collectFromNonEnumerableProperties( 
                    binding, component, proto, enhancedMethods) || enhanced;
        }
        return enhanced;
    };
    
    /** @private */
    prototype.checkAndCreateEnhancedMethod = function( 
            binding, component, enhancedMethods, name ) {
        if (typeof component[name] !== "function"
         || (this.matcher && !this.matcher( binding, component, name))) {
            return false;
        }
        var method = component[name];
        if ( this.isEnhancedMethod(method) ) {
            method[KEY].push(this.interceptor);
            return false;
        } else if ( this.isEnhancedObject(component) ) {
            Object.defineProperty( component, name, 
                this.createEnhancedMethod(component, name) );
            return false;
        } else {
            enhancedMethods[name] = 
                this.createEnhancedMethod(component, name);
            return true;
        }
    };
    
    /** @private */
    prototype.createEnhancedMethod = function( component, name ) {
        var original = component[name];
        var interceptors = [this.interceptor];
        var enhancedMethod = function(){
            var index = 0;
            var proceed = function(){
                return index < interceptors.length 
                    ? interceptors[index++].call( null, jointpoint )
                    : original.apply(jointpoint.self, jointpoint.arguments);
            };
            var args = [];
            args.push.apply(args, arguments);
            var jointpoint = Object.freeze({
                self : this,
                methodName : name,
                proceed : proceed,
                arguments : args,
                context : {}
            });
            return jointpoint.proceed();
        };
        enhancedMethod[KEY] = interceptors;
        return {
            value : enhancedMethod
        };
    };
    /** @private */
    prototype.isEnhancedMethod = function( method ) {
        return !!method[KEY];
    };
    /** @private */
    prototype.isEnhancedObject = function( obj ) {
        return !!obj[ENHANCED_FLAG];
    };
    /** @private */
    var KEY = "$ContainerJS.interceptors";
    /** @private */
    var ENHANCED_FLAG = "$ContainerJS.enhanced";
    
    return Aspect;
});