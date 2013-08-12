define([
    "container",
    "test/utils/wait",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, Wait, moduleA, moduleB, moduleC ) {
    
    describe('ContainerJS', function() {
        
        describe('Binding', function() {
            
            var container = new ContainerJS.Container( function( binder ){
                binder.bind( "test.modules.A" );
                binder.bind( "test.modules.B" ).asPrototype();
                binder.bind( "test.modules.C" ).asObject();
            });
            
            it( "can create a component that binds as class.", function() {
                var deferred = container.get( "test.modules.A" );
                Wait.forFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.A" ); 
                    expect( component instanceof moduleA ).toBe( true ); 
                }); 
            });
            
            it( "can create a component that binds as prototype.", function() {
                var deferred = container.get( "test.modules.B" );
                Wait.forFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.B" );
                    expect( moduleB.isPrototypeOf(component) ).toBe( true ); 
                }); 
            });
            
            it( "can create a component that binds as object.", function() {
                var deferred = container.get( "test.modules.C" );
                Wait.forFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.C" ); 
                    expect( moduleC === component ).toBe( true ); 
                }); 
            });
            
        });
        
    });
});