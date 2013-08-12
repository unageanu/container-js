define([
    "container",
    "test/utils/wait",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, Wait, moduleA, moduleB, moduleC ) {
    
    describe('ContainerJS', function() {
        
        describe('Injection', function() {
            
            var bindModules = function( binder ) {
                binder.bind("test.modules.B" ).asPrototype();
                binder.bind("test.modules.C" ).asObject();
                
                binder.bind("CollectionX" ).toInstance("a");
                binder.bind("CollectionX" ).toInstance("b");
                binder.bind("CollectionX" ).toInstance("c");
                
                binder.bind("CollectionY" ).toInstance("d");
                binder.bind("CollectionY" ).toInstance("e");
            };
            
            var assertThatPropertiesAreInjected = function( component ){
                expect( component["test.modules.B"].type ).toBe( "test.modules.B" ); 
                expect( component.injectedPoperty.type ).toBe( "test.modules.B" );
                
                expect( component["CollectionX"].length ).toBe( 3 ); 
                expect( component. injectedCollectionProperty.length ).toBe( 3 ); 
                
                Wait.forFix(component["test.modules.C"]);
                runs( function(){
                    var x = ContainerJS.utils.Deferred.unpack(component["test.modules.C"]);
                    expect(x.type).toBe( "test.modules.C" );
                });
                Wait.forFix(component.lazyInjectedProperty);
                runs( function(){
                    var x = ContainerJS.utils.Deferred.unpack(component.lazyInjectedProperty);
                    expect(x.type).toBe( "test.modules.C" );
                });
                
                Wait.forFix(component["CollectionY"]);
                runs( function(){
                    var x = ContainerJS.utils.Deferred.unpack(component["CollectionY"]);
                    expect(x.length).toBe( 2 );
                });
                Wait.forFix(component.lazyInjectedCollectionProperty);
                runs( function(){
                    var x = ContainerJS.utils.Deferred.unpack(component.lazyInjectedCollectionProperty);
                    expect(x.length).toBe( 2 );
                });
            };
            
            describe('Property Injection', function() {
                
                it( "can inject properties that specified in the module.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A" ).withProperties({
                            property : "foo",
                            
                            "test.modules.B" : ContainerJS.Inject,
                            injectedPoperty : ContainerJS.Inject("test.modules.B"),
                            
                            "test.modules.C" : ContainerJS.Inject.lazily,
                            lazyInjectedProperty : ContainerJS.Inject.lazily("test.modules.C"),
                            
                            "CollectionX" : ContainerJS.Inject.all,
                            injectedCollectionProperty : ContainerJS.Inject.all("CollectionX"),
                            
                            "CollectionY" : ContainerJS.Inject.all.lazily,
                            lazyInjectedCollectionProperty : ContainerJS.Inject.all.lazily("CollectionY")
                        });
                        bindModules(binder);
                    });
                    
                    var deferred = container.get( "test.modules.A" );
                    Wait.forFix(deferred);
                    
                    runs( function(){
                        var component = ContainerJS.utils.Deferred.unpack( deferred );
                        expect( component.property ).toBe( "foo" );
                        assertThatPropertiesAreInjected( component );
                    });
                });
                
                it( "can inject properties that specified in property definition.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.PropertyInjectionTest" );
                        bindModules(binder);
                    });
                    
                    var deferred = container.get( "test.modules.PropertyInjectionTest" );
                    Wait.forFix(deferred);
                    
                    runs( function(){
                        var component = ContainerJS.utils.Deferred.unpack( deferred );
                        assertThatPropertiesAreInjected( component );
                    });
                });
                
                it( "raises an error if the dependent component is not binded.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A").withProperties({
                            property : ContainerJS.Inject("test.modules.NotBinded")
                        });
                    });
                    
                    var deferred = container.get("test.modules.A");
                    Wait.forFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("component is not binded. name=test.modules.NotBinded") );
                    });
                });
                
                it( "raises an error if the dependent component is not found.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A").withProperties({
                            property : ContainerJS.Inject("test.modules.package1.NotFound")
                        });
                        binder.bind( "test.modules.package1.NotFound" )
                            .assign( ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE );
                    });
                    
                    var deferred = container.get("test.modules.A");
                    Wait.forFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("componenet 'test.modules.package1.NotFound' is not found in module 'test/modules/package1'.") );
                    });
                });
                
//                it( "raises an error if the dependent component contains syntax error.", function() {
//                    var container = new ContainerJS.Container( function( binder ){
//                        binder.bind("test.modules.A").withProperties({
//                            property : ContainerJS.Inject("test.modules.SyntaxError")
//                        });
//                        binder.bind("test.modules.SyntaxError");
//                    });
//                    
//                    var deferred = container.get("test.modules.A");
//                    Wait.forFix(deferred);
//                    
//                    runs( function(){
//                        expect( function() {
//                            ContainerJS.utils.Deferred.unpack( deferred );
//                        }).toThrow( );
//                    });
//                });
                
                it( "raises an error if a cyclic dependency exists.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A").withProperties({
                            propertyB : ContainerJS.Inject("test.modules.A")
                        });
                    });
                    
                    var deferred = container.get("test.modules.A");
                    Wait.forFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("detect cyclic dependency.\n  -> test.modules.A\n  -> test.modules.A") );
                    });
                });
            });
            
            describe('Constructor Injection', function() {
                
                it( "can inject constructor arguments.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A" ).withConstructorArgument( {
                            property : "foo",
                            
                            "test.modules.B" : ContainerJS.Inject,
                            injectedPoperty : ContainerJS.Inject("test.modules.B"),
                            
                            "test.modules.C" : ContainerJS.Inject.lazily,
                            lazyInjectedProperty : ContainerJS.Inject.lazily("test.modules.C"),
                            
                            "CollectionX" : ContainerJS.Inject.all,
                            injectedCollectionProperty : ContainerJS.Inject.all("CollectionX"),
                            
                            "CollectionY" : ContainerJS.Inject.all.lazily,
                            lazyInjectedCollectionProperty : ContainerJS.Inject.all.lazily("CollectionY")
                        } );
                        bindModules(binder);
                    });
                    
                    var deferred = container.get( "test.modules.A" );
                    Wait.forFix(deferred);
                    
                    runs( function(){
                        var component = ContainerJS.utils.Deferred.unpack( deferred );
                        expect( component.args.property ).toBe( "foo" );
                        assertThatPropertiesAreInjected( component.args );
                    });
                });
                
                it( "raises an error if the dependent component is not binded.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A").withConstructorArgument( {
                            property : ContainerJS.Inject("test.modules.NotBinded")
                        });
                    });
                    
                    var deferred = container.get("test.modules.A");
                    Wait.forFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("component is not binded. name=test.modules.NotBinded") );
                    });
                });
                
                it( "raises an error if the dependent component is not found.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A").withConstructorArgument( {
                            property : ContainerJS.Inject("test.modules.package1.NotFound")
                        });
                        binder.bind("test.modules.package1.NotFound")
                            .assign( ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE );
                    });
                    
                    var deferred = container.get("test.modules.A");
                    Wait.forFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("componenet 'test.modules.package1.NotFound' is not found in module 'test/modules/package1'.") );
                    });
                });
//                
//                it( "raises an error if the dependent component contains syntax error.", function() {
//                    var container = new ContainerJS.Container( function( binder ){
//                        binder.bind("test.modules.A").withConstructorArgument( {
//                            property : ContainerJS.Inject("test.modules.SyntaxError")
//                        });
//                        binder.bind("test.modules.SyntaxError");
//                    });
//                    
//                    var deferred = container.get("test.modules.A");
//                    Wait.forFix(deferred);
//                    
//                    runs( function(){
//                        expect( function() {
//                            ContainerJS.utils.Deferred.unpack( deferred );
//                        }).toThrow( );
//                    });
//                });
                
                it( "raises an error if a cyclic dependency exists.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A").withConstructorArgument( {
                            propertyB : ContainerJS.Inject("test.modules.B")
                        });
                        binder.bind("test.modules.B").asPrototype().withProperties({
                            propertyA : ContainerJS.Inject("test.modules.A")
                        });
                    });
                    
                    var deferred = container.get("test.modules.A");
                    Wait.forFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("detect cyclic dependency.\n  -> test.modules.A\n  -> test.modules.B\n  -> test.modules.A") );
                    });
                });
            });
        });
        
    });
});