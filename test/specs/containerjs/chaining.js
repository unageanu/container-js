define([
    "container",
    "test/utils/wait",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, Wait, moduleA, moduleB, moduleC ) {
    
    describe('ContainerJS', function() {
        
        describe('Chaining', function() {
            
            var parent = new ContainerJS.Container( function( binder ){
                binder.bind("test.modules.A");
                
                binder.bind("CollectionA").to("test.modules.A");
                binder.bind("CollectionA").to("test.modules.A");
                
                binder.bind("CollectionC").to("test.modules.A");
                binder.bind("CollectionC").to("test.modules.A");
                
                binder.bind("ErrorB").to("test.modules.A");
                binder.bind("ErrorB").to("test.modules.A").onInitialize(function(c){
                    throw new Error("test");
                });
            });
            var child = new ContainerJS.Container( function( binder ){
                binder.bind("test.modules.B").asPrototype().withProperties({
                    "A" : ContainerJS.Inject("test.modules.A")
                });
                binder.bind("test.modules.DependentComponentNotFound").asPrototype().withProperties({
                    "NotFound" : ContainerJS.Inject("NotFound")
                });
                binder.bind("CollectionA").to("test.modules.A");
                binder.bind("CollectionA").to("test.modules.A");
                
                binder.bind("CollectionB").to("test.modules.A");
                binder.bind("CollectionB").to("test.modules.A");
                
                binder.bind("ErrorA").to("test.modules.A");
                binder.bind("ErrorA").to("test.modules.A").onInitialize(function(c){
                    throw new Error("test");
                });
            });
            child.chain(parent);
            
            it( "returns a component that defined in the chained container.", function(done) {

                var deferred = child.get("test.modules.B");
                Wait.forFix(deferred, function(){
                    var component = ContainerJS.utils.Deferred.unpack(deferred);
                    expect( component.type ).toBe("test.modules.B" );
                    expect( component.A.type ).toBe("test.modules.A" );
                    done();
                });
            });
            
            it( "raises an error if the compornent is not defined in the container and the chained container.", function(done) {

                var deferred = child.get("test.modules.NotBinded");
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("component is not binded. name=test.modules.NotBinded") );
                    done();
                });
            });
            
            it( "raises an error if the dependent compornent is not defined in the chained container.", function(done) {

                var deferred = child.get("test.modules.DependentComponentNotFound");
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( );
                    done();
                });
            });
            
            it( "returns components that defined in the container and the chained container.", function(done) {

                var deferred = child.gets("CollectionA");
                Wait.forFix(deferred, function(){
                    var components = ContainerJS.utils.Deferred.unpack(deferred);
                    expect( components.length ).toBe(4);
                    done();
                });
            });
            
            it( "returns components that defined in the container.", function(done) {

                var deferred = child.gets("CollectionB");
                Wait.forFix(deferred, function(){
                    var components = ContainerJS.utils.Deferred.unpack(deferred);
                    expect( components.length ).toBe(2);
                    done();
                });
            });
            
            it( "returns components that defined in the chained container.", function(done) {

                var deferred = child.gets("CollectionC");
                Wait.forFix(deferred, function(){
                    var components = ContainerJS.utils.Deferred.unpack(deferred);
                    expect( components.length ).toBe(2);
                    done();
                });
            });
            
            it( "raises an error if compornents is not defined in the container and the chained container.", function(done) {

                var deferred = child.gets("test.modules.NotBinded");
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("component is not binded. name=test.modules.NotBinded") );
                    done();
                });
            });
            
            it( "raises an error if failed to initialize compornents that defined in the container.", function(done) {

                var deferred = child.gets("ErrorA");
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("test") );
                    done();
                });
            });
            
            it( "raises an error if failed to initialize compornents that defined in the chained container.", function(done) {

                var deferred = child.gets("ErrorB");
                Wait.forFix(deferred, function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("test") );
                    done();
                });
            });
        });
        
    });
});