define([
    "container",
    "test/utils/wait",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, Wait, moduleA, moduleB, moduleC ) {
    
    describe('ContainerJS', function() {
        
        describe('Naming', function() {
            
            var container = new ContainerJS.Container( function( binder ){
                binder.bind( "A" ).to( "test.modules.A" );
                binder.bind( "B" ).toPrototype( "test.modules.B" );
                binder.bind( "C" ).toObject( "test.modules.C" );
                binder.bind( "D" ).toProvider( function(){
                    return { type: "test.modules.D" };
                });
                binder.bind( "E" ).toInstance( { type: "test.modules.E" } );
            });
            
            it( "can create a named component.", function(done) {
                var deferred = container.get( "A" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.A" ); 
                    done();
                }); 
            });
            
            it( "can create a named component that binds as prototype.", function(done) {
                var deferred = container.get( "B" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.B" ); 
                    done();
                }); 
            });
            
            it( "can create a named component that binds as object.", function(done) {
                var deferred = container.get( "C" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.C" ); 
                    done();
                }); 
            });
            
            it( "can create a named component that provides from the provider.", function(done) {
                var deferred = container.get( "D" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.D" ); 
                    done();
                }); 
            });
            
            it( "can create a named component that binds as instance.", function(done) {
                var deferred = container.get( "E" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.E" ); 
                    done();
                }); 
            });
            
            it( "raises an error if the provider throws an error.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "D" ).toProvider( function(){
                        throw new Error("test");
                    });
                });
                
                var deferred = container.get( "D" );
                Wait.forFix(deferred,  function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("test") );
                    done();
                });
            });
        });
        
    });
});