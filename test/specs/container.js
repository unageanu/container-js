define([
    "container",
    "test/modules/a",
    "test/modules/b",
    "test/modules/c"
], function( ContainerJS, moduleA, moduleB, moduleC ) {
    
    var waitForFix = function( deferred ) {
        deferred.then( function(){} );
        waitsFor(function() {
            return deferred.fixed();
        }, null, 10000);
    };
    
    describe('ContainerJS', function() {
        
        describe('Packaging Policy', function() {
        
            it( "can create a component that defined in a file.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.A" );
                });
                
                var deferred = container.get( "test.modules.A" );
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.package2.A" );
                });
            });
            
            it( "raises an error if the file contains syntax error.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "test.modules.SyntaxError" );
                });
                
                var deferred = container.get( "test.modules.SyntaxError" );
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("componenet 'test.modules.SyntaxError' is not found in module 'test/modules/syntax-error'.") );
                });
            });
            
            it( "raises an error if the component is not binded.", function() {
                var container = new ContainerJS.Container( function( binder ){});
                
                var deferred = container.get( "test.modules.NotBinded" );
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("componenet 'test.modules.package2.NotFound' is not found in module 'test/modules/package2'.") );
                });
            });
        });
        
        describe('Binding', function() {
            
            var container = new ContainerJS.Container( function( binder ){
                binder.bind( "test.modules.A" );
                binder.bind( "test.modules.B" ).asPrototype();
                binder.bind( "test.modules.C" ).asObject();
            });
            
            it( "can create a component that binds as class.", function() {
                var deferred = container.get( "test.modules.A" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.A" ); 
                    expect( component instanceof moduleA ).toBe( true ); 
                }); 
            });
            
            it( "can create a component that binds as prototype.", function() {
                var deferred = container.get( "test.modules.B" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.B" );
                    expect( moduleB.isPrototypeOf(component) ).toBe( true ); 
                }); 
            });
            
            it( "can create a component that binds as object.", function() {
                var deferred = container.get( "test.modules.C" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.C" ); 
                    expect( moduleC === component ).toBe( true ); 
                }); 
            });
            
        });
        
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
            
            it( "can create a named component.", function() {
                var deferred = container.get( "A" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.A" ); 
                }); 
            });
            
            it( "can create a named component that binds as prototype.", function() {
                var deferred = container.get( "B" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.B" ); 
                }); 
            });
            
            it( "can create a named component that binds as object.", function() {
                var deferred = container.get( "C" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.C" ); 
                }); 
            });
            
            it( "can create a named component that provides from the provider.", function() {
                var deferred = container.get( "D" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.D" ); 
                }); 
            });
            
            it( "can create a named component that binds as instance.", function() {
                var deferred = container.get( "E" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.type ).toBe( "test.modules.E" ); 
                }); 
            });
            
            it( "raises an error if the provider throws an error.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "D" ).toProvider( function(){
                        throw new Error("test");
                    });
                });
                
                var deferred = container.get( "D" );
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("test") );
                });
            });
        });
        
        describe('Multi Binding', function() {
            var container = new ContainerJS.Container( function( binder ){
                binder.bind( "CollectionA" ).to( "test.modules.A" );
                binder.bind( "CollectionA" ).toPrototype( "test.modules.package1.B" )
                    .assign( ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE );
                binder.bind( "CollectionA" ).to( "test.modules.package2.A" )
                    .loadFrom( "test/modules/package2")
                    .assign( ContainerJS.PackagingPolicy.SINGLE_FILE );
            });
            
            it( "can create components.", function() {
                var deferred = container.gets( "CollectionA" );
                waitForFix(deferred);
                
                runs( function(){
                    var components = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( components.length ).toBe( 3 ); 
                    
                    var types = components.map( function(c){ 
                        return c.type; 
                    });
                    expect( types ).toContain( "test.modules.A" );
                    expect( types ).toContain( "test.modules.package1.B" );
                    expect( types ).toContain( "test.modules.package2.A" );
                }); 
            });
            
            it( "raises an error if the component is not binded.", function() {
                var container = new ContainerJS.Container( function( binder ){});
                
                var deferred = container.gets( "test.modules.NotBinded" );
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("component is not binded. name=test.modules.NotBinded") );
                });
            });
            
            it( "raises an error if the component is not found  in the module.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "CollectionA" ).to( "test.modules.A" );
                    binder.bind( "CollectionA" ).to( "test.modules.package1.NotFound" )
                        .assign( ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE );
                    binder.bind( "CollectionA" ).toPrototype( "test.modules.B" );
                });
                
                var deferred = container.gets( "CollectionA" );
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("componenet 'test.modules.package1.NotFound' is not found in module 'test/modules/package1'.") );
                }); 
            });
            
            it( "raises an error if the file contains syntax error.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind( "CollectionA" ).to( "test.modules.A" );
                    binder.bind( "CollectionA" ).to( "test.modules.SyntaxError" );
                    binder.bind( "CollectionA" ).toPrototype( "test.modules.B" );
                });
                
                var deferred = container.gets( "CollectionA" );
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("componenet 'test.modules.SyntaxError' is not found in module 'test/modules/syntax-error'.") );
                });
            });
        });
        
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
                
                waitForFix(component["test.modules.C"]);
                runs( function(){
                    var x = ContainerJS.utils.Deferred.unpack(component["test.modules.C"]);
                    expect(x.type).toBe( "test.modules.C" );
                });
                waitForFix(component.lazyInjectedProperty);
                runs( function(){
                    var x = ContainerJS.utils.Deferred.unpack(component.lazyInjectedProperty);
                    expect(x.type).toBe( "test.modules.C" );
                });
                
                waitForFix(component["CollectionY"]);
                runs( function(){
                    var x = ContainerJS.utils.Deferred.unpack(component["CollectionY"]);
                    expect(x.length).toBe( 2 );
                });
                waitForFix(component.lazyInjectedCollectionProperty);
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
                    waitForFix(deferred);
                    
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
                    waitForFix(deferred);
                    
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
                    waitForFix(deferred);
                    
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
                    waitForFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("componenet 'test.modules.package1.NotFound' is not found in module 'test/modules/package1'.") );
                    });
                });
                
                it( "raises an error if the dependent component contains syntax error.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A").withProperties({
                            property : ContainerJS.Inject("test.modules.SyntaxError")
                        });
                        binder.bind("test.modules.SyntaxError");
                    });
                    
                    var deferred = container.get("test.modules.A");
                    waitForFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("componenet 'test.modules.SyntaxError' is not found in module 'test/modules/syntax-error'.") );
                    });
                });
                
                it( "raises an error if a cyclic dependency exists.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A").withProperties({
                            propertyB : ContainerJS.Inject("test.modules.A")
                        });
                    });
                    
                    var deferred = container.get("test.modules.A");
                    waitForFix(deferred);
                    
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
                    waitForFix(deferred);
                    
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
                    waitForFix(deferred);
                    
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
                    waitForFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("componenet 'test.modules.package1.NotFound' is not found in module 'test/modules/package1'.") );
                    });
                });
                
                it( "raises an error if the dependent component contains syntax error.", function() {
                    var container = new ContainerJS.Container( function( binder ){
                        binder.bind("test.modules.A").withConstructorArgument( {
                            property : ContainerJS.Inject("test.modules.SyntaxError")
                        });
                        binder.bind("test.modules.SyntaxError");
                    });
                    
                    var deferred = container.get("test.modules.A");
                    waitForFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("componenet 'test.modules.SyntaxError' is not found in module 'test/modules/syntax-error'.") );
                    });
                });
                
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
                    waitForFix(deferred);
                    
                    runs( function(){
                        expect( function() {
                            ContainerJS.utils.Deferred.unpack( deferred );
                        }).toThrow( new Error("detect cyclic dependency.\n  -> test.modules.A\n  -> test.modules.B\n  -> test.modules.A") );
                    });
                });
            });
        });
        
        describe('Initializer And Destructor', function() {
            it( "executes a initializer and destructor that specified in module by method name.", function() {
                var container = new ContainerJS.Container( function( binder ){
                    binder.bind("Test").to("test.modules.InitializerAndDestructor")
                        .onInitialize("initialize")
                        .onDestroy("destroy");
                });
                
                var deferred = container.get("Test");
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
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
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    container.destroy();
                    expect( component.initialized ).toBeUndefined();
                    expect( component.destroyed ).toBeUndefined();
                });
            });
        });
        
        describe('Scope', function() {
            it( "returns same instance if  the component scope is singleton.", function() {
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
                waitForFix(deferred1);
                waitForFix(deferred2);
                
                runs( function(){
                    var component1 = ContainerJS.utils.Deferred.unpack( deferred1 );
                    var component2 = ContainerJS.utils.Deferred.unpack( deferred2 );
                    
                    expect(  component1 ===  component2 ).toBe(true);
                    expect(  component1.X ===  component2.X ).toBe(true);
                    expect(  component1.Y ===  component2.Y ).toBe(true);
                    
                    container.destroy();
                    expect( component1.destroyed ).toBe(true);
                    expect( component2.destroyed ).toBe(true);
                });
            });
            
            it( "returns same instance if  the component scope is eager singleton.", function() {
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
                
                expect( initialized ).toBe(true);
                
                var deferred1 = container.get("test.modules.A");
                var deferred2 = container.get("test.modules.A");
                waitForFix(deferred1);
                waitForFix(deferred2);
                
                runs( function(){
                    var component1 = ContainerJS.utils.Deferred.unpack( deferred1 );
                    var component2 = ContainerJS.utils.Deferred.unpack( deferred2 );
                    
                    expect(  component1 ===  component2 ).toBe(true);
                    expect(  component1.X ===  component2.X ).toBe(true);
                    expect(  component1.Y ===  component2.Y ).toBe(true);
                    
                    container.destroy();
                    expect( component1.destroyed ).toBe(true);
                    expect( component2.destroyed ).toBe(true);
                });
            });
            
            it( "returns new instance  if  the component scope is prototype.", function() {
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
                waitForFix(deferred1);
                waitForFix(deferred2);
                
                runs( function(){
                    var component1 = ContainerJS.utils.Deferred.unpack( deferred1 );
                    var component2 = ContainerJS.utils.Deferred.unpack( deferred2 );
                    
                    expect(  component1 ===  component2 ).toBe(false);
                    expect(  component1.X ===  component2.X ).toBe(true);
                    expect(  component1.Y ===  component2.Y ).toBe(false);
                });
            });
        });
        
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
            
            it( "can apply interceptors to a component.", function() {
                var deferred = container.get( "A" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.methodA("!") ).toBe( "a_!_2_1" ); 
                    expect( component.methodB("!") ).toBe( "b_!_1" );
                    expect( component.methodC("!") ).toBe( "c_!_2_1" );
                }); 
            });
            
            it( "can apply interceptors to a component that binds as prototype.", function() {
                var deferred = container.get( "B" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.methodA("!") ).toBe( "a_!_2_1" ); 
                    expect( component.methodB("!") ).toBe( "b_!_1" );
                    expect( component.methodC("!") ).toBe( "c_!_2_1" );
                }); 
            });
            
            it( "can apply interceptors to a component that binds as object.", function() {
                var deferred = container.get( "C" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.methodA("!") ).toBe( "a_!_2_1" ); 
                    expect( component.methodB("!") ).toBe( "b_!_1" );
                    expect( component.methodC("!") ).toBe( "c_!_2_1" );
                }); 
            });
            
            it( "can apply interceptors to a component that provides from the provider.", function() {
                var deferred = container.get( "D" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.methodA("!") ).toBe( "a_!_2_1" ); 
                    expect( component.methodB("!") ).toBe( "b_!_1" );
                    expect( component.methodC("!") ).toBe( "c_!_2_1" );
                }); 
            });
            
            it( "can apply interceptors to a component that binds as instance.", function() {
                var deferred = container.get( "E" );
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack( deferred );
                    expect( component.methodA("!") ).toBe( "a_!_2_1" ); 
                    expect( component.methodB("!") ).toBe( "b_!_1" );
                    expect( component.methodC("!") ).toBe( "c_!_2_1" ); 
                }); 
            });
        });
        
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
            
            it( "returns a component that defined in the chained container.", function() {

                var deferred = child.get("test.modules.B");
                waitForFix(deferred);
                
                runs( function(){
                    var component = ContainerJS.utils.Deferred.unpack(deferred);
                    expect( component.type ).toBe("test.modules.B" );
                    expect( component.A.type ).toBe("test.modules.A" );
                });
            });
            
            it( "raises an error if the compornent is not defined in the container and the chained container.", function() {

                var deferred = child.get("test.modules.NotBinded");
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("component is not binded. name=test.modules.NotBinded") );
                });
            });
            
            it( "raises an error if the dependent compornent is not defined in the chained container.", function() {

                var deferred = child.get("test.modules.DependentComponentNotFound");
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( );
                });
            });
            
            it( "returns components that defined in the container and the chained container.", function() {

                var deferred = child.gets("CollectionA");
                waitForFix(deferred);
                
                runs( function(){
                    var components = ContainerJS.utils.Deferred.unpack(deferred);
                    expect( components.length ).toBe(4);
                });
            });
            
            it( "returns components that defined in the container.", function() {

                var deferred = child.gets("CollectionB");
                waitForFix(deferred);
                
                runs( function(){
                    var components = ContainerJS.utils.Deferred.unpack(deferred);
                    expect( components.length ).toBe(2);
                });
            });
            
            it( "returns components that defined in the chained container.", function() {

                var deferred = child.gets("CollectionC");
                waitForFix(deferred);
                
                runs( function(){
                    var components = ContainerJS.utils.Deferred.unpack(deferred);
                    expect( components.length ).toBe(2);
                });
            });
            
            it( "raises an error if compornents is not defined in the container and the chained container.", function() {

                var deferred = child.gets("test.modules.NotBinded");
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("component is not binded. name=test.modules.NotBinded") );
                });
            });
            
            it( "raises an error if failed to initialize compornents that defined in the container.", function() {

                var deferred = child.gets("ErrorA");
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("test") );
                });
            });
            
            it( "raises an error if failed to initialize compornents that defined in the chained container.", function() {

                var deferred = child.gets("ErrorB");
                waitForFix(deferred);
                
                runs( function(){
                    expect( function() {
                        ContainerJS.utils.Deferred.unpack( deferred );
                    }).toThrow( new Error("test") );
                });
            });
        });
    });
});