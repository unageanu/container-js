define([
    "container",
    "test/utils/wait",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, Wait, moduleA, moduleB, moduleC ) {
    
    describe('ContainerJS', function() {
        describe('Packaging Policy', function() {
        
            it( "can create a component that defined in a file.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.A" );
                });
                
                var deferred = container.get( "test.modules.A" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.A" );
                    done();
                });
            });
    
            it( "can create a component that defined in module.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.package1.A" )
                        .assign( ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE );
                });
                
                var deferred = container.get( "test.modules.package1.A" );
                Wait.forFix(deferred,  function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.package1.A" );
                    done();
                });
            });
            
            it( "can create a component that defined in single file module.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.package2.A" )
                        .loadFrom( "test/modules/package2")
                        .assign( ContainerJS.PackagingPolicy.SINGLE_FILE );
                });
                
                var deferred = container.get( "test.modules.package2.A" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.package2.A" );
                    done();
                });
            });
            
// test failed on rhino environment...
//
//            it( "raises an error if the file contains syntax error.", function(done) {
//                var container = new ContainerJS.Container( function( binder ){
//                    binder.bind( "test.modules.SyntaxError" );
//                });
//                
//                var deferred = container.get( "test.modules.SyntaxError" );
//                Wait.forFix(deferred, function(){
//                    expect( function() {
//                        ContainerJS.utils.Deferred.unpack( deferred );
//                    }).toThrow( );
//                    done();
//                });
//            });
            
            it( "raises an error if the component is not binded.", function(done) {
                var container = new ContainerJS.Container( function( binder ){});
                
                var deferred = container.get( "test.modules.NotBinded" );
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("component is not binded. name=test.modules.NotBinded") );
                    done();
                });
            });
            
            it( "raises an error if the component is not found.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.NotFound" );
                });
                
                var deferred = container.get( "test.modules.NotFound" );
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow(new Error("componenet 'test.modules.NotFound' is not found in module 'test/modules/not-found'."));
                    done();
                });
            });
            
            it( "raises an error if the component is not found in the module.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.package1.NotFound" )
                        .assign( ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE );
                });
                
                var deferred = container.get( "test.modules.package1.NotFound" );
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("componenet 'test.modules.package1.NotFound' is not found in module 'test/modules/package1'.") );
                    done();
                });
            });
            
            it( "raises an error if the component is not found in the file.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.package2.NotFound" )
                        .loadFrom( "test/modules/package2")
                        .assign( ContainerJS.PackagingPolicy.SINGLE_FILE );
                });
                
                var deferred = container.get( "test.modules.package2.NotFound" );
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("componenet 'test.modules.package2.NotFound' is not found in module 'test/modules/package2'.") );
                    done();
                });
            });
            
            it( "can configure the packaging policy by a second argument for the constructor of container.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.package1.A" );
                }, ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE);
                
                var deferred = container.get( "test.modules.package1.A" );
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.package1.A" );
                    done();
                });
            });
        });
    });
});