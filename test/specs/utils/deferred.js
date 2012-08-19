
define(["containerjs/utils/deferred"], function(Deferred) {
    
    describe('Deferred', function() {
        
        var deferred;
        var log = null;
        
        beforeEach(function() {
            log = [];
            deferred = new Deferred();
        });
        
        describe('when it is not resolved or rejected', function() {
            
            it( "'then' does nothing.", function() {
                deferred.then( function(result){
                    log.push("success");
                }, function(error){
                    log.push("fail");
                });
                expect(log.length).toBe( 0 );
            });
            
            it( "'done' does nothing.", function() {
                deferred.done( function(result){
                    log.push("success");
                });
                expect(log.length).toBe( 0 );
            });
            
            it( "'fail' does nothing.", function() {
                deferred.fail( function(error){
                    log.push("fail");
                });
                expect(log.length).toBe( 0 );
            });
            
            it( "'always' does nothing.", function() {
                deferred.always( function(result){
                    log.push("success");
                });
                expect(log.length).toBe( 0 );
            });
            
            it( "'fixed' returns false.", function() {
                expect(deferred.fixed()).toEqual( false );
            });
            
            it( "'resolved' returns false.", function() {
                expect(deferred.resolved()).toEqual( false );
            });
            
            it( "'rejected' returns false.", function() {
                expect(deferred.rejected()).toEqual( false );
            });
        });
        
        describe('when it resolved', function() {
            
            beforeEach(function() {
                deferred.resolve("result");
            });
            
            it( "'then' executes a successCallback.", function() {
                deferred.then( function(result){
                    log.push(result);
                }, function(error){
                    log.push("fail");
                });
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "result" );
            });
            
            it( "'done' executes a successCallback.", function() {
                deferred.done( function(result){
                    log.push(result);
                });
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "result" );
            });
            
            it( "'fail' does nothing.", function() {
                deferred.fail( function(error){
                    log.push("fail");
                });                
                expect(log.length).toBe( 0 );
            });
            
            it( "'always' executes a callback.", function() {
                deferred.always( function(result){
                    log.push(result);
                });
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "result" );
            });
            
            it( "'resolve' raises an error.", function() {
                expect(function(){
                    deferred.resolve("result");
                }).toThrow( {message:"already resolved or rejected."} );
            });
            
            it( "'reject' raises an error.", function() {
                expect(function(){
                    deferred.reject("error");
                }).toThrow( {message:"already resolved or rejected."} );
            });
           
            it( "'fixed' returns true.", function() {
                expect(deferred.fixed()).toEqual( true );
            });
            
            it( "'resolved' returns true.", function() {
                expect(deferred.resolved()).toEqual( true );
            });
            
            it( "'rejected' returns false.", function() {
                expect(deferred.rejected()).toEqual( false );
            });
        });
        
        
        describe('when it rejected', function() {
            
            beforeEach(function() {
                deferred.reject("error");
            });
            
            it( "'then' executes a failCallback.", function() {
                deferred.then( function(result){
                    log.push(result);
                }, function(error){
                    log.push(error);
                });
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "error" );
            });
            
            it( "'done' does nothing.", function() {
                deferred.done( function(result){
                    log.push(result);
                });
                expect(log.length).toBe( 0 );
            });
            
            it( "'fail' executes a failCallback.", function() {
                deferred.fail( function(error){
                    log.push(error);
                });
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "error" );
            });
            
            it( "'always' executes a callback.", function() {
                deferred.always( function(result){
                    log.push(result);
                });
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "error" );
            });
            
            it( "'resolve' raises an error.", function() {
                expect(function(){
                    deferred.resolve("result");
                }).toThrow( {message:"already resolved or rejected."} );
            });
            
            it( "'reject' raises an error.", function() {
                expect(function(){
                    deferred.reject("error");
                }).toThrow( {message:"already resolved or rejected."} );
            });
            
            it( "'fixed' returns true.", function() {
                expect(deferred.fixed()).toEqual( true );
            });
            
            it( "'resolved' returns false.", function() {
                expect(deferred.resolved()).toEqual( false );
            });
            
            it( "'rejected' returns true.", function() {
                expect(deferred.rejected()).toEqual( true );
            });
            
        });
        
        describe( "when a callback is registerd by 'then'", function() {
 
            beforeEach(function() {
                deferred.then( function(result){
                    log.push("success:" + result);
                }, function(error){
                    log.push("fail:" + error);
                });
            });
            
            it( "'resolve' executes a successCallback.", function() {
                deferred.resolve( "result" );
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "success:result" );
            });
            
            it( "'reject' executes a failCallback.", function() {
                deferred.reject( "error" );
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "fail:error" );
            });
            
        });
        
        describe( "when a callback is registerd by 'done'", function() {
 
            beforeEach(function() {
                deferred.done( function(result){
                    log.push("success:" + result);
                });
            });
            
            it( "'resolve' executes a successCallback.", function() {
                deferred.resolve( "result" );    
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "success:result" );
            });
            
            it( "'reject' does nothing.", function() {
                deferred.reject( "error" );
                expect(log.length).toBe( 0 );
            });
            
        });
        
        
        describe( "when callback is registerd by 'fail'", function() {
            
            beforeEach(function() {
                deferred.fail( function(error){
                    log.push("fail:" + error);
                });
            });
            
            it( "'resolve' does nothing.", function() {
                deferred.resolve( "result" );    
                expect(log.length).toBe( 0 );
            });
            
            it( "'reject' executes a failCallback.", function() {
                deferred.reject( "error" );
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "fail:error" );
            });
            
        });
        
        describe( "when callback is registerd by 'always'", function() {
            
            beforeEach(function() {
                deferred.always( function(result){
                    log.push(result);
                });
            });
            
            it( "'resolve' executes a callback.", function() {
                deferred.resolve( "result" );    
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "result" );
            });
            
            it( "'reject' executes a callback.", function() {
                deferred.reject( "error" );
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "error" );
            });
            
        });
        
        describe( "'then' returns a promise.", function() {
            
            var promise = null;
            var doNothing = function(){};
            
            it( "executes a successCallback when original deferred's successCallback is executed without error.", function() {
                promise = deferred.then( function( result ) {
                    return "successCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    deferred.resolve( "result" );
                    return "successCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's successCallback raises an error.", function() {
                promise = deferred.then( function( result ) {
                    throw "successCallbackError";
                } );
                assertFailCallbackIsExecutedWhen( promise, function(){
                    deferred.resolve( "result" );
                    return "successCallbackError";
                });
            });
            
            it( "executes a successCallback when original deferred's failCallback is executed without error.", function() {
                promise = deferred.then( null, function( result ) {
                    return "failCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    deferred.reject( "error" );
                    return "failCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's failCallback raises an error.", function() {
                promise = deferred.then( null, function( result ) {
                    throw "failCallbackError";
                });
                assertFailCallbackIsExecutedWhen( promise, function(){
                    deferred.reject( "error" );
                    return "failCallbackError";
                });
            });
            
            it( "executes a successCallback when original deferred's successCallback is executed without error before 'then'.", function() {
                deferred.resolve( "result" );
                promise = deferred.then( function( result ) {
                    return "successCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    return "successCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's successCallback raises an error before 'then'.", function() {
                deferred.resolve( "result" );
                promise = deferred.then( function( result ) {
                    throw "successCallbackError";
                } );
                assertFailCallbackIsExecutedWhen( promise, function(){
                    return "successCallbackError";
                });
            });
            
            it( "executes a successCallback when original deferred's failCallback is executed without error before 'then'.", function() {
                deferred.reject( "error" );
                promise = deferred.then( null, function( result ) {
                    return "failCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    return "failCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's failCallback raises an error before 'then'.", function() {
                deferred.reject( "error" );
                promise = deferred.then( null, function( result ) {
                    throw "failCallbackError";
                });
                assertFailCallbackIsExecutedWhen( promise, function(){
                    return "failCallbackError";
                });
            });
        });
        
        describe( "'done' returns a promise.", function() {
            
            var promise = null;
            
            it( "executes a successCallback when original deferred's successCallback is executed without error.", function() {
                promise = deferred.done( function( result ) {
                    return "successCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    deferred.resolve( "result" );
                    return "successCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's successCallback raises an error.", function() {
                promise = deferred.done( function( result ) {
                    throw "successCallbackError";
                } );
                assertFailCallbackIsExecutedWhen( promise, function(){
                    deferred.resolve( "result" );
                    return "successCallbackError";
                });
            });
            
            it( "executes a successCallback when original deferred's successCallback is executed without error before 'done'.", function() {
                deferred.resolve( "result" );
                promise = deferred.done( function( result ) {
                    return "successCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    return "successCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's successCallback raises an error before 'done'.", function() {
                deferred.resolve( "result" );
                promise = deferred.done( function( result ) {
                    throw "successCallbackError";
                } );
                assertFailCallbackIsExecutedWhen( promise, function(){
                    return "successCallbackError";
                });
            });
        });
        
        describe( "'fail' returns a promise.", function() {
            
            var promise = null;
            
            it( "executes a successCallback when original deferred's failCallback is executed without error.", function() {
                promise = deferred.fail( function( result ) {
                    return "failCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    deferred.reject( "error" );
                    return "failCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's failCallback raises an error.", function() {
                promise = deferred.fail( function( result ) {
                    throw "failCallbackError";
                });
                assertFailCallbackIsExecutedWhen( promise, function(){
                    deferred.reject( "error" );
                    return "failCallbackError";
                });
            });
            
            it( "executes a successCallback when original deferred's failCallback is executed without error before 'fail'.", function() {
                deferred.reject( "error" );
                promise = deferred.fail( function( result ) {
                    return "failCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    return "failCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's failCallback raises an error before 'fail'.", function() {
                deferred.reject( "error" );
                promise = deferred.fail( function( result ) {
                    throw "failCallbackError";
                });
                assertFailCallbackIsExecutedWhen( promise, function(){
                    return "failCallbackError";
                });
            });
        });
        
        describe( "'always' returns a promise.", function() {
            
            var promise = null;
            
            it( "executes a successCallback when original deferred's successCallback is executed without error.", function() {
                promise = deferred.always( function( result ) {
                    return "successCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    deferred.resolve( "result" );
                    return "successCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's successCallback raises an error.", function() {
                promise = deferred.always( function( result ) {
                    throw "successCallbackError";
                } );
                assertFailCallbackIsExecutedWhen( promise, function(){
                    deferred.resolve( "result" );
                    return "successCallbackError";
                });
            });
            
            it( "executes a successCallback when original deferred's failCallback is executed without error.", function() {
                promise = deferred.always( function( result ) {
                    return "failCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    deferred.reject( "error" );
                    return "failCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's failCallback raises an error.", function() {
                promise = deferred.always( function( result ) {
                    throw "failCallbackError";
                });
                assertFailCallbackIsExecutedWhen( promise, function(){
                    deferred.reject( "error" );
                    return "failCallbackError";
                });
            });
            
            it( "executes a successCallback when original deferred's successCallback is executed without error before 'always'.", function() {
                deferred.resolve( "result" );
                promise = deferred.always( function( result ) {
                    return "successCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    return "successCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's successCallback raises an error before 'always'.", function() {
                deferred.resolve( "result" );
                promise = deferred.always( function( result ) {
                    throw "successCallbackError";
                } );
                assertFailCallbackIsExecutedWhen( promise, function(){
                    return "successCallbackError";
                });
            });
            
            it( "executes a successCallback when original deferred's failCallback is executed without error before 'always'.", function() {
                deferred.reject( "error" );
                promise = deferred.always( function( result ) {
                    return "failCallbackResult";
                } );
                assertSuccessCallbackIsExecutedWhen( promise, function(){
                    return "failCallbackResult";
                });
            });
            
            it( "executes a failCallback when original deferred's failCallback raises an error before 'always'.", function() {
                deferred.reject( "error" );
                promise = deferred.always( function( result ) {
                    throw "failCallbackError";
                });
                assertFailCallbackIsExecutedWhen( promise, function(){
                    return "failCallbackError";
                });
            });
        });
        var assertSuccessCallbackIsExecutedWhen = function( deferred, operation ) {
            
            deferred.then( function(result){
                log.push( "success:" + result );
            }, function(error){
                log.push( "fail:" + error );
            });
            var result = operation();
            
            expect(log.length).toBe( 1 );
            expect(log[0]).toBe( "success:" + result );
            
        };
        var assertFailCallbackIsExecutedWhen = function( deferred, operation ) {
            
            deferred.then( function(result){
                log.push( "success:" + result );
            }, function(error){
                log.push( "fail:" + error );
            });
            var error = operation();
            
            expect(log.length).toBe( 1 );
            expect(log[0]).toBe( "fail:" + error );
            
        };
        
        it( "success callbacks are executed in registration order.", function() {
            deferred.then( function(result){
                log.push("1");
            });
            deferred.done( function(result){
                log.push("2");
            });
            deferred.always( function(result){
                log.push("3");
            });
            deferred.resolve("success");
            expect(log.length).toBe( 3 );
            expect(log[0]).toBe( "1" );
            expect(log[1]).toBe( "2" );
            expect(log[2]).toBe( "3" );
        });
        
        it( "fail callbacks are executed in registration order.", function() {
            deferred.then( null, function(result){
                log.push("1");
            });
            deferred.fail( function(result){
                log.push("2");
            });
            deferred.always( function(result){
                log.push("3");
            });
            deferred.reject("fail");
            expect(log.length).toBe( 3 );
            expect(log[0]).toBe( "1" );
            expect(log[1]).toBe( "2" );
            expect(log[2]).toBe( "3" );
        });
        
        describe( "'pormise' returns a promise", function() {
            
            var promise = null;
            beforeEach(function() {
                promise = deferred.promise();
            });
            
            describe('when the deferred is not resolved or rejected', function() {
                
                it( "'then' does nothing.", function() {
                    promise.then( function(result){
                        log.push("success");
                    }, function(error){
                        log.push("fail");
                    });
                    expect(log.length).toBe( 0 );
                });
                
                it( "'done' does nothing.", function() {
                    promise.done( function(result){
                        log.push("success");
                    });
                    expect(log.length).toBe( 0 );
                });
                
                it( "'fail' does nothing.", function() {
                    promise.fail( function(error){
                        log.push("fail");
                    });
                    expect(log.length).toBe( 0 );
                });
                
                it( "'always' does nothing.", function() {
                    promise.always( function(result){
                        log.push("success");
                    });
                    expect(log.length).toBe( 0 );
                });
            });
            
            describe('when the deferred is resolved', function() {
                
                beforeEach(function() {
                    deferred.resolve("result");
                });
                
                it( "'then' executes a successCallback.", function() {
                    promise.then( function(result){
                        log.push(result);
                    }, function(error){
                        log.push("fail");
                    });
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "result" );
                });
                
                it( "'done' executes a successCallback.", function() {
                    promise.done( function(result){
                        log.push(result);
                    });
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "result" );
                });
                
                it( "'fail' does nothing.", function() {
                    promise.fail( function(error){
                        log.push("fail");
                    });                
                    expect(log.length).toBe( 0 );
                });
                
                it( "'always' executes a callback.", function() {
                    promise.always( function(result){
                        log.push(result);
                    });
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "result" );
                });
                
            });
            
            
            describe('when the deferred is rejected', function() {
                
                beforeEach(function() {
                    deferred.reject("error");
                });
                
                it( "'then' executes a failCallback.", function() {
                    promise.then( function(result){
                        log.push(result);
                    }, function(error){
                        log.push(error);
                    });
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "error" );
                });
                
                it( "'done' does nothing.", function() {
                    promise.done( function(result){
                        log.push(result);
                    });
                    expect(log.length).toBe( 0 );
                });
                
                it( "'fail' executes a failCallback.", function() {
                    promise.fail( function(error){
                        log.push(error);
                    });
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "error" );
                });
                
                it( "'always' executes a callback.", function() {
                    promise.always( function(result){
                        log.push(result);
                    });
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "error" );
                });
                
            });
            
            describe( "when a callback is registerd by 'then'", function() {
     
                beforeEach(function() {
                    promise.then( function(result){
                        log.push("success:" + result);
                    }, function(error){
                        log.push("fail:" + error);
                    });
                });
                
                it( "'resolve' executes a successCallback.", function() {
                    deferred.resolve( "result" );
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "success:result" );
                });
                
                it( "'reject' executes a failCallback.", function() {
                    deferred.reject( "error" );
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "fail:error" );
                });
                
            });
            
            describe( "when a callback is registerd by 'done'", function() {
     
                beforeEach(function() {
                    promise.done( function(result){
                        log.push("success:" + result);
                    });
                });
                
                it( "'resolve' executes a successCallback.", function() {
                    deferred.resolve( "result" );    
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "success:result" );
                });
                
                it( "'reject' does nothing.", function() {
                    deferred.reject( "error" );
                    expect(log.length).toBe( 0 );
                });
                
            });
            
            
            describe( "when a callback is registerd by 'fail'", function() {
                
                beforeEach(function() {
                    promise.fail( function(error){
                        log.push("fail:" + error);
                    });
                });
                
                it( "'resolve' does nothing.", function() {
                    deferred.resolve( "result" );    
                    expect(log.length).toBe( 0 );
                });
                
                it( "'reject' executes a failCallback.", function() {
                    deferred.reject( "error" );
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "fail:error" );
                });
                
            });
            
            describe( "when a callback is registerd by 'always'", function() {
                
                beforeEach(function() {
                    promise.always( function(result){
                        log.push(result);
                    });
                });
                
                it( "'resolve' executes a callback.", function() {
                    deferred.resolve( "result" );    
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "result" );
                });
                
                it( "'reject' executes a callback.", function() {
                    deferred.reject( "error" );
                    expect(log.length).toBe( 1 );
                    expect(log[0]).toBe( "error" );
                });
                
            });
        });
        
        describe( "'pipe' returns a filtered promise.", function() {
            
            var promise = null;
            
            it( "resolves with a filtered result.", function() {
                
                promise = deferred.pipe( function( result ) {
                    return result + ":a";
                });
                promise.done( function(result){
                    log.push(result);
                });
                deferred.resolve("result");
                
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "result:a" );
            });
            
            it( "rejects with a filtered error.", function() {
                
                promise = deferred.pipe( null, function( error ) {
                    return error + ":a";
                });
                promise.fail( function(result){
                    log.push(result);
                });
                deferred.reject("error");
                
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "error:a" );
            });
            
            it( "when filter rises an error, then it rejects with the error.", function() {
                
                promise = deferred.pipe( function( result ) {
                    throw "error";
                });
                promise.fail( function(error){
                    log.push(error);
                });
                deferred.resolve("result");
                
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "error" );
            });
            
            it( "when errorFilter rises an error, then the error is ignored.", function() {
                
                promise = deferred.pipe( null, function( error ) {
                    throw "error";
                });
                promise.fail( function(error){
                    log.push(error);
                });
                deferred.reject("original error");
                
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "original error" );
            });
        });
        
        it( "'valueOf' returns a resolved pormise.", function() {
            
            var pormise = Deferred.valueOf("result")
            expect(pormise.resolved()).toEqual( true );
            
            pormise.done(function(result){
                log.push(result);
            });
            expect(log.length).toBe( 1 );
            expect(log[0]).toBe( "result" );
        });
        
        it( "'errorOf' returns a rejected pormise.", function() {
            
            var pormise = Deferred.errorOf("error")
            expect(pormise.rejected()).toEqual( true );
            
            pormise.fail(function(error){
                log.push(error);
            });
            expect(log.length).toBe( 1 );
            expect(log[0]).toBe( "error" );
        });
        
        describe( "'when' retuens a promise.", function() {
            
            var deferreds = [];
            beforeEach(function() {
                deferreds = [];
                for ( var i=0;i<5;i++ ) {
                    deferreds.push(new Deferred());
                }
                deferred = Deferred.when( deferreds );
                deferred.then( function(result){
                    log.push(result)
                }, function(error){
                    log.push(error);
                });
            });
            
            it( "resolved when the deferreds is empty.", function() {
                
                deferred = Deferred.when( [] );
                deferred.then( function(result){
                    log.push(result)
                }, function(error){
                    log.push(error);
                });
                
                expect(deferred.fixed()).toEqual( true );
                expect(log.length).toBe( 1 );
                expect(log[0].length).toBe( 0 );
            });
            
            it( "resolved when all the deferreds are resolved.", function() {
                
                expect(deferred.fixed()).toEqual( false );
                expect(log.length).toBe( 0 );
                
                deferreds.forEach( function(d, i){
                    d.resolve(i);
                });
                
                expect(deferred.fixed()).toEqual( true );
                expect(log.length).toBe( 1 );
                expect(log[0].length).toBe( 5 );
                expect(log[0][0]).toBe( 0 );
                expect(log[0][1]).toBe( 1 );
                expect(log[0][2]).toBe( 2 );
                expect(log[0][3]).toBe( 3 );
                expect(log[0][4]).toBe( 4 );
            });
            
            it( "rejected when one of the deferreds are rejected.", function() {
                
                expect(deferred.fixed()).toEqual( false );
                expect(log.length).toBe( 0 );
                
                deferreds.forEach( function(d, i){
                    if ((i % 2) === 1 ) {
                        d.reject("error" + i);
                    } else {
                        d.resolve(i);
                    }
                });
                
                expect(deferred.fixed()).toEqual( true );
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "error1" );
            });
            
            it( "resolved by an array of the same order as the deferreds.", function() {
                
                expect(deferred.fixed()).toEqual( false );
                expect(log.length).toBe( 0 );
                
                deferreds[0].resolve(0);
                deferreds[4].resolve(4);
                deferreds[3].resolve(3);
                deferreds[1].resolve(1);
                deferreds[2].resolve(2);
                
                expect(deferred.fixed()).toEqual( true );
                expect(log.length).toBe( 1 );
                expect(log[0].length).toBe( 5 );
                expect(log[0][0]).toBe( 0 );
                expect(log[0][1]).toBe( 1 );
                expect(log[0][2]).toBe( 2 );
                expect(log[0][3]).toBe( 3 );
                expect(log[0][4]).toBe( 4 );
            });
        });
        
        describe( "'pack' returns a promise.", function() {
            
            it( "resolved with the result of procedure.", function() {
                
                var promise = Deferred.pack(function(){
                   return "result"; 
                });
                expect(promise.resolved()).toEqual( true );
                
                promise.done(function(result){
                    log.push(result);
                });
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "result" );
            });
            
            it( "rejected with the error of procedure.", function() {
                
                var promise = Deferred.pack(function(){
                   throw "error"; 
                });
                expect(promise.rejected()).toEqual( true );
                
                promise.fail(function(error){
                    log.push(error);
                });
                expect(log.length).toBe( 1 );
                expect(log[0]).toBe( "error" );
            });
            
        });
        
        it( "'unpack' returns a result of promise.", function() {
            expect( Deferred.unpack( Deferred.valueOf( "result" ) )).toBe("result");
        });
        
        it( "'unpack' throws an error of promise.", function() {
            expect( function() {
                Deferred.unpack( Deferred.errorOf( new Error("test") )) ;
            }).toThrow( new Error("test") );
        });
        
    });
    
});