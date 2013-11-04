define([
    "container",
    "test/utils/wait",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, Wait, moduleA, moduleB, moduleC ) {
    
    describe('ContainerJS', function() {
        describe('Packaging Policy', function() {
        
            it( "can create a component that defined in a file.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.A" );
                });
                
                var deferred = container.get( "test.modules.A" );
                Wait.forFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.A" );
                });
            });
    
            it( "can create a component that defined in module.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.package1.A" )
                        .assign( ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE );
                });
                
                var deferred = container.get( "test.modules.package1.A" );
                Wait.forFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.package1.A" );
                });
            });
            
            it( "can create a component that defined in single file module.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.package2.A" )
                        .loadFrom( "test/modules/package2")
                        .assign( ContainerJS.PackagingPolicy.SINGLE_FILE );
                });
                
                var deferred = container.get( "test.modules.package2.A" );
                Wait.forFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.package2.A" );
                });
            });
            
// test failed on rhino environment...
//
//            it( "raises an error if the file contains syntax error.", function() {
//                var container = new ContainerJS.Container( function( binder ){
//                    binder.bind( "test.modules.SyntaxError" );
//                });
//                
//                var deferred = container.get( "test.modules.SyntaxError" );
//                Wait.forFix(deferred);
//                
//                runs( function(){
//                    expect( function() {
//                        ContainerJS.utils.Deferred.unpack( deferred );
//                    }).toThrow( );
//                });
//            });
            
            it( "raises an error if the component is not binded.", function() {
                var container = new ContainerJS.Container( function( binder ){});
                
                var deferred = container.get( "test.modules.NotBinded" );
                Wait.forFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("component is not binded. name=test.modules.NotBinded") );
                });
            });
            
            it( "raises an error if the component is not found.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.NotFound" );
                });
                
                var deferred = container.get( "test.modules.NotFound" );
                Wait.forFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow("componenet 'test.modules.NotFound' is not found in module 'test/modules/not-found'.");
                });
            });
            
            it( "raises an error if the component is not found in the module.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.package1.NotFound" )
                        .assign( ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE );
                });
                
                var deferred = container.get( "test.modules.package1.NotFound" );
                Wait.forFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("componenet 'test.modules.package1.NotFound' is not found in module 'test/modules/package1'.") );
                });
            });
            
            it( "raises an error if the component is not found in the file.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.package2.NotFound" )
                        .loadFrom( "test/modules/package2")
                        .assign( ContainerJS.PackagingPolicy.SINGLE_FILE );
                });
                
                var deferred = container.get( "test.modules.package2.NotFound" );
                Wait.forFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("componenet 'test.modules.package2.NotFound' is not found in module 'test/modules/package2'.") );
                });
            });
            
            it( "can configure the packaging policy by a second argument for the constructor of container.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.package1.A" );
                }, ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE);
                
                var deferred = container.get( "test.modules.package1.A" );
                Wait.forFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.package1.A" );
                });
            });
        });
    });
});