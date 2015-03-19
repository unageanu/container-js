define( function(){
    
    "use strict";
    
    /**
     * @interface 
     * @template V, E value type, error type
     */
    var Promise = {};

    /**
     * @param {function(V):R} successCallback
     * @param {function(E):R} failCallback
     * @return {Promise.<R,*>} 
     */
    Promise.then = function( successCallback, failCallback ){};

    /**
     * @param {function((V|E)):R} callback
     * @return {Promise.<R,*>} 
     */
    Promise.always = function( callback ){};

    /**
     * @param {function(V):R} successCallback
     * @return {Promise.<R,*>} 
     */
    Promise.done = function( successCallback ){};

    /**
     * @param {function(E):R} failCallback
     * @return {Promise.<R,*>} 
     */
    Promise.fail = function( failCallback ){};

    /**
     * @template X, Y
     * @param {function(V):X} resultFilter
     * @param {function(E):Y=} errorFilter
     * @return {Promise.<X,Y>}
     */
    Promise.pipe = function( resultFilter, errorFilter ){};
    
    /**
     * @return {boolean} 
     */
    Promise.fixed = function(){};
    
    /**
     * @return {boolean} 
     */
    Promise.rejected = function(){};
    
    /**
     * @return {boolean} 
     */
    Promise.resolved = function(){};
    
    /**
     * @class 
     * @implements {Promise}
     */
    var Deferred = function(){
        this.state = states.unresolved;
        this.result = null;
        this.successCallbacks = [];
        this.failCallbacks = [];
        Object.seal( this );
    };
    
    /** @override */
    Deferred.prototype.then = function( successCallback, failCallback ){
        var d = new Deferred();
        this.state.done.call(this, successCallback, d);
        this.state.fail.call(this, failCallback, d);
        return d;
    };
    /** @override */
    Deferred.prototype.always = function( callback ){
        return this.then(callback, callback);
    };
    /** @override */
    Deferred.prototype.done = function( successCallback ){
        var d = new Deferred();
        this.state.done.call(this, successCallback, d);
        return d;
    };
    /** @override */
    Deferred.prototype.fail = function( failCallback ){
        var d = new Deferred();
        this.state.fail.call(this, failCallback, d);
        return d;
    };
    /**
     * @param {V} result
     * @return {Deferred.<V,E>} this 
     */
    Deferred.prototype.resolve = function( result ){
        this.state.resolve.call(this, result);
        return this;
    };
    /**
     * @param {E} error
     * @return {Deferred.<V,E>} this 
     */
    Deferred.prototype.reject = function( error ){
        this.state.reject.call(this, error);
        return this;
    };
    
    /** @override */
    Deferred.prototype.fixed = function(){
        return this.rejected() || this.resolved();
    };
    /** @override */
    Deferred.prototype.rejected = function(){
        return this.state === states.rejected;
    };
    /** @override */
    Deferred.prototype.resolved = function(){
        return this.state === states.resolved;
    };
    
    /**
     * @return {Promise.<V,E>}
     */
    Deferred.prototype.promise = function( ){
        return Object.freeze( {
            then     : this.then.bind( this ),
            done     : this.done.bind( this ),
            fail     : this.fail.bind( this ),
            always   : this.always.bind( this ),
            pipe     : this.pipe.bind( this ),
            fixed    : this.fixed.bind( this ),
            rejected : this.rejected.bind( this ),
            resolved : this.resolved.bind( this )
        });
    };
    
    /** @override */
    Deferred.prototype.pipe = function( resultFilter, errorFilter ) {
        var d = new Deferred();
        this.then( function( result ){
            try {
                d.resolve( resultFilter ? resultFilter(result) : result );
            } catch (e) {
                d.reject( errorFilter ? errorFilter(e) : e );
            }
        }, function( error ){
            try {
                error = errorFilter ? errorFilter(error) : error;
            } catch (e) {}
            d.reject( error );
        });
        return d.promise();
    };
    
    /**
     * @template <X>
     * @param {X} value
     * @return {Promise.<X,*>}
     */
    Deferred.valueOf = function( value ) {
        var d = new Deferred();
        d.resolve(value);
        return d.promise();
    };
    
    /**
     * @template <X>
     * @param {X} error
     * @return {Promise.<*,X>}
     */
    Deferred.errorOf = function( error ) {
        var d = new Deferred();
        d.reject(error);
        return d.promise();
    };
    
    /**
     * @template <X>
     * @param {Array.<Deferred.<X,*>>} deferreds
     * @return {Promise.<Array.<X>,*>}
     */
    Deferred.when = function( deferreds ) {
        var d = new Deferred();
        var results = [];
        if ( deferreds.length === 0 ) {
            d.resolve(results);
        } else {
            var counter = deferreds.length;
            var errorback = function( error ) {
                if ( !d.fixed() ) d.reject(error);
            };
            deferreds.forEach( function(deferred, i){
                deferred.then(function( result ) {
                    results[i] = result;
                    if ( --counter === 0 && !d.fixed() ) {
                        d.resolve(results);
                    }
                }, errorback);
            });
        }
        return d.promise();
    };
    
    /**
     * @param {*} object
     * @return {boolean}
     */
    Deferred.isPromise = function( object ) {
        for ( var i in Promise ) {
            if ( !object[i] ) return false;
        }
        return true;
    };
    
    /**
     * @template <X>
     * @param {function():X} procedure
     * @param {*=} self
     * @param {Array.<*>=} args
     * @return {Promise.<X,*>}
     */
    Deferred.pack = function( procedure, self, args ) {
        var d = new Deferred();
        try {
            var result = procedure.apply(self, args);
            if ( Deferred.isPromise( result ) ) {
                return result;
            } else {
                d.resolve( result );
            }
        } catch( e ) {
            d.reject( e );
        }
        return d.promise();
    };
    
    /**
     * @param {Promise.<V,E>} deferred
     * @return {V}
     * @throws {E}
     */
    Deferred.unpack = function( deferred ) {
        var result = null;
        var error = null;
        deferred.then( function(r){
            result = r;
        }, function( e ) {
            error = e;
        });
        if ( error ) throw error;
        return result;
    };
    
    /**
     * @template <X>
     * @param {function(*):X} procedure
     * @return {function(*):Promise.<X,*>}
     */
    Deferred.defer = function( procedure ) {
        return function() {
            return Deferred.pack( procedure, this, arguments );
        };
    };
    
    /**
     * @template <X>
     * @param {function(*):X} procedure
     * @param {*} self
     * @param {Array.<*>} args
     * @return {Promise.<X,*>}
     */
    Deferred.lazy = function( procedure, self, args ) {
        var d = new Deferred();
        var start = function() {
            try {
                var result = procedure.apply(self, args);
                if ( Deferred.isPromise( result ) ) {
                    result.then( function(r){
                        d.resolve( r );
                    }, function(e) {
                        d.reject( e );
                    } );
                } else {
                    d.resolve( result );
                }
            } catch( e ) {
                d.reject( e );
            }
        };
        d.state = {
            done : function( successCallback, deferred ) {
                states.unresolved.done.apply(this, arguments);
                this.state = states.unresolved;
                start();
            },
            fail : function( failCallback, deferred ) {
                states.unresolved.fail.apply(this, arguments);
                this.state = states.unresolved;
                start();
            },
            resolve : states.unresolved.resolve,
            reject : states.unresolved.reject
        };
        return d;
    };
    
    /** @private */
    var alreadyFixed = function() {
        throw new Error("already resolved or rejected.");
    };
    /** @private */
    var notify = function( callback, result ){
        callback.call( null, result );
    };
    /** @private */
    var notifyAll = function( callbacks, result ){
        var i, n;
        for ( i=0, n=callbacks.length; i<n; i++ ) {
            notify( callbacks[i], result );
        }
    };
    /** @private */
    var chain = function( callback, deferred ){
        return function(resultOrError){
            try {
                var result = callback(resultOrError);
                deferred.resolve(result);
            } catch (er) {
                deferred.reject(er);
            }
        };
    };
    /** @private */
    var states = {
        unresolved : {
            done : function( successCallback, deferred ) {
                this.successCallbacks.push( chain( successCallback, deferred ) );
                return deferred;
            },
            fail : function( failCallback, deferred ) {
                this.failCallbacks.push( chain( failCallback, deferred ) );
                return deferred;
            },
            resolve : function( result ){
                this.result = result;
                this.state = states.resolved;
                notifyAll( this.successCallbacks, result );
                this.successCallbacks = undefined;
            },
            reject: function( error ){
                this.result = error;
                this.state = states.rejected;
                notifyAll( this.failCallbacks, error );
                this.failCallbacks = undefined;
            }
        },
        resolved : {
            done : function( successCallback, deferred ) {
                chain( successCallback, deferred )(this.result);
            },
            fail : function( failCallback, deferred ) {},
            resolve : alreadyFixed,
            reject :  alreadyFixed
        },
        rejected : {
            done : function( successCallback, deferred ) {},
            fail : function( failCallback, deferred ) {
                chain( failCallback, deferred )(this.result);
            },
            resolve : alreadyFixed,
            reject :  alreadyFixed
        }
    };
    
    return Deferred;
});