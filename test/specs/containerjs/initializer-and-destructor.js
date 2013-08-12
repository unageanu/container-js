define([
    "container",
    "test/utils/wait",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, Wait, moduleA, moduleB, moduleC ) {
    
    describe('ContainerJS', function() {
        
        describe('Initializer And Destructor', function() {
            it( "executes a initializer and destructor that specified in module by method name.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("Test").to("test.modules.InitializerAndDestructor")
                        .onInitialize("initialize")
                        .onDestroy("destroy");
                });
                
                var deferred = container.get("Test");
                Wait.forFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.initialized ).toBe(true);
                    expect( component.destroyed ).toBeUndefined();
                    
                    container.destroy();
                    expect( component.destroyed ).toBe(true);
                });
            });
            
            it( "executes a initializer and destructor that specified in module by function.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("Test").to("test.modules.InitializerAndDestructor")
                        .onInitialize(function(c) { c.initializedByFunction = true; })
                        .onDestroy(function(c) { c.destroyedByFunction = true; });
                });
                
                var deferred = container.get("Test");
                Wait.forFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.initialized ).toBeUndefined();
                    expect( component.destroyed ).toBeUndefined();
                    expect( component.initializedByFunction ).toBe(true);
                    expect( component.destroyedByFunction ).toBeUndefined();
                    
                    container.destroy();
                    expect( component.initialized ).toBeUndefined();
                    expect( component.destroyed ).toBeUndefined();
                    expect( component.initializedByFunction ).toBe(true);
                    expect( component.destroyedByFunction ).toBe(true);
                });
            });
            
            it( "raises an error if  the initializer raises an error.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("Test").to("test.modules.InitializerAndDestructor")
                        .onInitialize("initialize").withProperties({
                            raisesErrorOnInitialize : true
                        });
                });
                
                var deferred = container.get("Test");
                Wait.forFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("failed to initialize.") );
                });
            });
            
            it( "raises an error if  the initializer raises an error.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("Test").to("test.modules.InitializerAndDestructor")
                        .onInitialize(function(){ throw new Error("test"); })
                });
                
                var deferred = container.get("Test");
                Wait.forFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("test") );
                });
            });
            
            it( "raises an error if  the destructor raises an error.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("Test").to("test.modules.InitializerAndDestructor")
                        .onDestroy("destroy").withProperties({
                            raisesErrorOnDestroy : true
                        });
                });
                
                var deferred = container.get("Test");
                Wait.forFix(deferred);
                
                runs( function(){
                    expect( function() {
                        container.destroy();
                    }).toThrow( new Error("failed to destroy.") );
                });
            });
            
            it( "raises an error if  thedestructor raises an error.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("Test").to("test.modules.InitializerAndDestructor")
                        .onDestroy(function(){ throw new Error("test"); })
                });
                
                var deferred = container.get("Test");
                Wait.forFix(deferred);
                
                runs( function(){
                    expect( function() {
                        container.destroy();
                    }).toThrow( new Error("test") );
                });
            });
            
            it( "raises an error if  the initializer not defined.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("Test").to("test.modules.InitializerAndDestructor")
                        .onInitialize("not found")
                });
                
                var deferred = container.get("Test");
                Wait.forFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( );
                });
            });
            
            it( "raises an error if  the destructor not defined.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("Test").to("test.modules.InitializerAndDestructor")
                        .onDestroy("not found")
                });
                
                var deferred = container.get("Test");
                Wait.forFix(deferred);
                
                runs( function(){
                    expect( function() {
                        container.destroy();
                    }).toThrow();
                });
            });
            
            it( "is not execute a destructor if  the component scope is not singleton.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("Test").to("test.modules.InitializerAndDestructor")
                        .onDestroy("destroy")
                        .inScope( ContainerJS.Scope.PROTOTYPE );
                });
                
                var deferred = container.get("Test");
                Wait.forFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    container.destroy();
                    expect( component.initialized ).toBeUndefined();
                    expect( component.destroyed ).toBeUndefined();
                });
            });
        });
        
    });
});