define([
    "container",
    "test/utils/wait",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, Wait, moduleA, moduleB, moduleC ) {
    
    describe('ContainerJS', function() {
        
        describe('Scope', function() {
            it( "returns same instance if the component scope is singleton.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("test.modules.A").onDestroy(function(c){
                        c.destroyed = true;
                    }).withProperties({
                        X : ContainerJS.Inject,
                        Y : ContainerJS.Inject
                    });
                    binder.bind("X").to("test.modules.A");
                    binder.bind("Y").to("test.modules.A")
                        .inScope( ContainerJS.Scope.PROTOTYPE );
                });
                
                var deferred1 = container.get("test.modules.A");
                var deferred2 = container.get("test.modules.A");
                Wait.forFix(deferred1, function(){
                    Wait.forFix(deferred2, function(){
                        var component1 = ContainerJS.utils.Deferred.unpack( deferred1 );
                        var component2 = ContainerJS.utils.Deferred.unpack( deferred2 );
                        
                        expect(  component1 ===  component2 ).toBe(true);
                        expect(  component1.X ===  component2.X ).toBe(true);
                        expect(  component1.Y ===  component2.Y ).toBe(true);
                        
                        container.destroy();
                        expect( component1.destroyed ).toBe(true);
                        expect( component2.destroyed ).toBe(true);
                        done();
                    });
                });
            });
            
            it( "returns same instance if the component scope is eager singleton.", function(done) {
                var initialized = false;
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("test.modules.A").onInitialize(function(c){
                        initialized = true;
                    }).onDestroy(function(c){
                        c.destroyed = true;
                    }).withProperties({
                        X : ContainerJS.Inject,
                        Y : ContainerJS.Inject
                    }).inScope( ContainerJS.Scope.EAGER_SINGLETON );
                    binder.bind("X").to("test.modules.A");
                    binder.bind("Y").to("test.modules.A")
                        .inScope( ContainerJS.Scope.PROTOTYPE );
                });
                
                var deferred1 = container.get("test.modules.A");
                var deferred2 = container.get("test.modules.A");
                Wait.forFix(deferred1, function(){
                    Wait.forFix(deferred2, function(){
                        var component1 = ContainerJS.utils.Deferred.unpack( deferred1 );
                        var component2 = ContainerJS.utils.Deferred.unpack( deferred2 );
                        
                        expect(  component1 ===  component2 ).toBe(true);
                        expect(  component1.X ===  component2.X ).toBe(true);
                        expect(  component1.Y ===  component2.Y ).toBe(true);
                        
                        container.destroy();
                        expect( component1.destroyed ).toBe(true);
                        expect( component2.destroyed ).toBe(true);
                        done();
                    });
                });
            });
            
            it( "returns new instance  if  the component scope is prototype.", function(done) {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("test.modules.A")
                        .inScope( ContainerJS.Scope.PROTOTYPE )
                        .withProperties({
                            X : ContainerJS.Inject,
                            Y : ContainerJS.Inject
                        });
                    binder.bind("X").to("test.modules.A");
                    binder.bind("Y").to("test.modules.A")
                        .inScope( ContainerJS.Scope.PROTOTYPE );
                });
                
                var deferred1 = container.get("test.modules.A");
                var deferred2 = container.get("test.modules.A");
                Wait.forFix(deferred1, function(){
                    Wait.forFix(deferred2, function(){
                        var component1 = ContainerJS.utils.Deferred.unpack( deferred1 );
                        var component2 = ContainerJS.utils.Deferred.unpack( deferred2 );
                        
                        expect(  component1 ===  component2 ).toBe(false);
                        expect(  component1.X ===  component2.X ).toBe(true);
                        expect(  component1.Y ===  component2.Y ).toBe(false);
                        done();
                    });
                });
            });
        });
        
    });
});