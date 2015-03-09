define([
    "container",
    "test/utils/wait",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, Wait, moduleA, moduleB, moduleC ) {
    
    describe('ContainerJS', function() {
        
        describe('Multi Binding', function() {
            var container = new ContainerJS.Container( function( binder ){
                binder.bind( "CollectionA" ).to( "test.modules.A" );
                binder.bind( "CollectionA" ).toPrototype( "test.modules.package1.B" )
                    .assign( ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE );
                binder.bind( "CollectionA" ).to( "test.modules.package2.A" )
                    .loadFrom( "test/modules/package2")
                    .assign( ContainerJS.PackagingPolicy.SINGLE_FILE );
            });
            
            it( "can create components.", function(done) {
                var deferred = container.gets( "CollectionA" );
                Wait.forFix(deferred, function(){
                    var components = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( components.length ).toBe( 3 ); 
                    
                    var types = components.map( function(c){ 
                        return c.type; 
                    });
                    expect( types ).toContain( "test.modules.A" );
                    expect( types ).toContain( "test.modules.package1.B" );
                    expect( types ).toContain( "test.modules.package2.A" );
                    done();
                }); 
            });
            
            it( "raises an error if the component is not binded.", function(done) {
                var container = new ContainerJS.Container( function( binder ){});
                
                var deferred = container.gets( "test.modules.NotBinded" );
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("component is not binded. name=test.modules.NotBinded") );
                    done();
                });
            });
            
            it( "raises an error if the component is not found  in the module.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "CollectionA" ).to( "test.modules.A" );
                    binder.bind( "CollectionA" ).to( "test.modules.package1.NotFound" )
                        .assign( ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE );
                    binder.bind( "CollectionA" ).toPrototype( "test.modules.B" );
                });
                
                var deferred = container.gets( "CollectionA" );
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("componenet 'test.modules.package1.NotFound' is not found in module 'test/modules/package1'.") );
                    done();
                }); 
            });

// test failed on rhino environment...
//            it( "raises an error if the file contains syntax error.", function(done) {
//                var container = new ContainerJS.Container( function( binder ){
//                    binder.bind( "CollectionA" ).to( "test.modules.A" );
//                    binder.bind( "CollectionA" ).to( "test.modules.SyntaxError" );
//                    binder.bind( "CollectionA" ).toPrototype( "test.modules.B" );
//                });
//                
//                var deferred = container.gets( "CollectionA" );
//                Wait.forFix(deferred, function(){
//                    expect( function() {
//                        ContainerJS.utils.Deferred.unpack( deferred );
//                    }).toThrow( );
//                    done();
//                });
//            });
        });
        
    });
});