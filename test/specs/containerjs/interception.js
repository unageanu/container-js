define([
    "container",
    "test/utils/wait",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, Wait, moduleA, moduleB, moduleC ) {
    
    describe('ContainerJS', function() {
        
        describe('Interception', function() {
            
            var container = new ContainerJS.Container( function( binder ){
                var properties = {
                    methodC : function(arg) {
                        return "c_" + arg;
                    }
                };
                
                binder.bind( "A" ).to( "test.modules.A" ).withProperties(properties);
                binder.bind( "B" ).toPrototype( "test.modules.B" ).withProperties(properties);
                binder.bind( "C" ).toObject( "test.modules.C" ).withProperties(properties);
                binder.bind( "D" ).toProvider( function(){
                    return { 
                        type: "test.modules.D",
                        methodA : function(arg) {
                            return "a_" + arg;
                        },
                        methodB : function(arg) {
                            return "b_" + arg;
                        }
                    };
                }).withProperties(properties);
                binder.bind( "E" ).toInstance( { 
                    type: "test.modules.E",
                    methodA : function(arg) {
                        return "a_" + arg;
                    },
                    methodB : function(arg) {
                        return "b_" + arg;
                    }
                }).withProperties(properties);
                
                binder.bindInterceptor( function(jp) {
                    return jp.proceed() + "_1";
                });
                binder.bindInterceptor( function(jp) {
                    return jp.proceed() + "_2";
                }, function(binding, component, methodName) {
                    return methodName === "methodA"
                         || methodName === "methodC";
                });
            });
            
            it( "can apply interceptors to a component.", function(done) {
                var deferred = container.get( "A" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.methodA("!") ).toBe( "a_!_2_1" ); 
                    expect( component.methodB("!") ).toBe( "b_!_1" );
                    expect( component.methodC("!") ).toBe( "c_!_2_1" );
                    done();
                }); 
            });
            
            it( "can apply interceptors to a component that binds as prototype.", function(done) {
                var deferred = container.get( "B" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.methodA("!") ).toBe( "a_!_2_1" ); 
                    expect( component.methodB("!") ).toBe( "b_!_1" );
                    expect( component.methodC("!") ).toBe( "c_!_2_1" );
                    done();
                }); 
            });
            
            it( "can apply interceptors to a component that binds as object.", function(done) {
                var deferred = container.get( "C" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.methodA("!") ).toBe( "a_!_2_1" ); 
                    expect( component.methodB("!") ).toBe( "b_!_1" );
                    expect( component.methodC("!") ).toBe( "c_!_2_1" );
                    done();
                }); 
            });
            
            it( "can apply interceptors to a component that provides from the provider.", function(done) {
                var deferred = container.get( "D" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.methodA("!") ).toBe( "a_!_2_1" ); 
                    expect( component.methodB("!") ).toBe( "b_!_1" );
                    expect( component.methodC("!") ).toBe( "c_!_2_1" );
                    done();
                }); 
            });
            
            it( "can apply interceptors to a component that binds as instance.", function(done) {
                var deferred = container.get( "E" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.methodA("!") ).toBe( "a_!_2_1" ); 
                    expect( component.methodB("!") ).toBe( "b_!_1" );
                    expect( component.methodC("!") ).toBe( "c_!_2_1" ); 
                    done();
                }); 
            });
        });
        
    });
});