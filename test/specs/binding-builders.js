define([
    "containerjs/binding-builders",
    "containerjs/scope"
], function(builders, Scope) {
    
    var binding = null;
    var reference = {
        set : function(b){
            binding = b;
        },
        get : function(){
            return binding;
        }
    };
    
    describe('RootBuilder', function() {
        
        var builder = null;
        var log = [];
        
        beforeEach(function() {
            binding = { name:"test" };
            builder = Object.create( builders.RootBuilder, { 
                reference : { 
                    value : reference 
                }
            });
            log = [];
        });
        
        it( "can build ConstructorBinding.", function() {
            
            builder.to( "test.A" );
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.constructor).toEqual("test.A");
            expect(binding.constructorArgument).toBeUndefined();
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ConstructorBinding with constructor argument.", function() {
            
            builder.to( "test.A").withConstructorArgument({foo:"var"});
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.constructor).toEqual("test.A");
            expect(binding.constructorArgument).toEqual({foo:"var"});
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ConstructorBinding with scope.", function() {
            
            builder.to( "test.A" ).inScope(Scope.EAGER_SINGLETON);
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.EAGER_SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.constructor).toEqual("test.A");
            expect(binding.constructorArgument).toBeUndefined();
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ConstructorBinding with injection properties.", function() {
            
            builder.to( "test.A" ).withProperties({foo:"var"});
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({foo:"var"});
            expect(binding.constructor).toEqual("test.A");
            expect(binding.constructorArgument).toBeUndefined();
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ConstructorBinding with module.", function() {
            
            builder.to( "test.A" ).loadFrom("module");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.constructor).toEqual("test.A");
            expect(binding.constructorArgument).toBeUndefined();
            expect(binding.module).toEqual("module");
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ConstructorBinding with initializer.", function() {
            
            builder.to( "test.A" ).onInitialize("init");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.constructor).toEqual("test.A");
            expect(binding.constructorArgument).toBeUndefined();
            expect(binding.module).toBeUndefined();
            assertInitializerIsRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ConstructorBinding with destructor.", function() {
            
            builder.to( "test.A" ).onDestroy(function(){
                log.push("destroyed");
            });
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.constructor).toEqual("test.A");
            expect(binding.constructorArgument).toBeUndefined();
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsRegistered();
        });
        
        it( "can build ConstructorBinding with all options.", function() {
            
            builder.to( "test.A" )
                .withConstructorArgument({foo:"var"})
                .loadFrom("module")
                .withProperties({hoge:"var"})
                .inScope(Scope.EAGER_SINGLETON)
                .onInitialize(function(){
                    log.push("initialized");
                }).onDestroy("destroy");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.EAGER_SINGLETON);
            expect(binding.injectionProperties).toEqual({hoge:"var"});
            expect(binding.constructor).toEqual("test.A");
            expect(binding.constructorArgument).toEqual({foo:"var"});
            expect(binding.module).toEqual("module");
            assertInitializerIsRegistered();
            assertDestructorIsRegistered();
        });
        
        
        it( "can build PrototypeBinding.", function() {
            
            builder.asPrototype({
                foo : {
                    value : "var"
                } 
            });
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.prototype).toEqual("test");
            expect(binding.prototypeProperties).toEqual({
                foo : {
                    value : "var"
                } 
            });
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build PrototypeBinding with name.", function() {
            
            builder.toPrototype( "test.A" );
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.prototype).toEqual("test.A");
            expect(binding.prototypeProperties).toBeUndefined();
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build PrototypeBinding with properties.", function() {
            
            builder.toPrototype( "test.A", {
                foo : {
                    value : "var"
                } 
            });
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.prototype).toEqual("test.A");
            expect(binding.prototypeProperties).toEqual({
                foo : {
                    value : "var"
                } 
            });
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build PrototypeBinding with scope.", function() {
            
            builder.toPrototype( "test.A" ).inScope( Scope.EAGER_SINGLETON );
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.EAGER_SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.prototype).toEqual("test.A");
            expect(binding.prototypeProperties).toBeUndefined();
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build PrototypeBinding with injection properties.", function() {
            
            builder.toPrototype( "test.A" ).withProperties({foo:"var"});
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({foo:"var"});
            expect(binding.prototype).toEqual("test.A");
            expect(binding.prototypeProperties).toBeUndefined();
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build PrototypeBinding with load module.", function() {
            
            builder.toPrototype( "test.A" ).loadFrom( "module" );
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.prototype).toEqual("test.A");
            expect(binding.prototypeProperties).toBeUndefined();
            expect(binding.module).toEqual("module");
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build PrototypeBinding with initializer.", function() {
            
            builder.toPrototype( "test.A" ).onInitialize("init");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.prototype).toEqual("test.A");
            expect(binding.prototypeProperties).toBeUndefined();
            expect(binding.module).toBeUndefined();
            assertInitializerIsRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build PrototypeBinding with destructor.", function() {
            
            builder.toPrototype( "test.A" ).onDestroy(function(){
                log.push("destroyed");
            });
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.prototype).toEqual("test.A");
            expect(binding.prototypeProperties).toBeUndefined();
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsRegistered();
        });
        
        it( "can build PrototypeBinding with all options.", function() {
            
            builder.toPrototype( "test.A", {
                foo : {
                    value : "var"
                } 
            }).loadFrom( "module" )
            .withProperties({hoge:"var"})
            .inScope(Scope.EAGER_SINGLETON)
            .onInitialize(function(){
                log.push("initialized");
            }).onDestroy("destroy");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.EAGER_SINGLETON);
            expect(binding.injectionProperties).toEqual({hoge:"var"});
            expect(binding.prototype).toEqual("test.A");
            expect(binding.prototypeProperties).toEqual({
                foo : {
                    value : "var"
                } 
            });
            expect(binding.module).toEqual("module");
            assertInitializerIsRegistered();
            assertDestructorIsRegistered();
        });
        
        
        it( "can build ObjectBinding.", function() {
            
            builder.asObject();
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.object).toEqual("test");
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ObjectBinding with name.", function() {
            
            builder.toObject( "test.A" );
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.object).toEqual("test.A");
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ObjectBinding with scope.", function() {
            
            builder.toObject( "test.A" ).inScope( Scope.EAGER_SINGLETON );
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.EAGER_SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.object).toEqual("test.A");
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ObjectBinding with injection properties.", function() {
            
            builder.toObject( "test.A" ).withProperties({foo:"var"});
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({foo:"var"});
            expect(binding.object).toEqual("test.A");
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ObjectBinding with load module.", function() {
            
            builder.toObject( "test.A" ).loadFrom( "module" );
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.object).toEqual("test.A");
            expect(binding.module).toEqual("module");
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ObjectBinding with initializer.", function() {
            
            builder.toObject( "test.A" ).onInitialize("init");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.object).toEqual("test.A");
            expect(binding.module).toBeUndefined();
            assertInitializerIsRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ObjectBinding with destructor.", function() {
            
            builder.toObject( "test.A" ).onDestroy(function(){
                log.push("destroyed");
            });
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.object).toEqual("test.A");
            expect(binding.module).toBeUndefined();
            assertInitializerIsNotRegistered();
            assertDestructorIsRegistered();
        });
        
        it( "can build ObjectBinding with all options.", function() {
            
            builder.toObject( "test.A", {
                foo : {
                    value : "var"
                } 
            }).loadFrom( "module" )
            .withProperties({hoge:"var"})
            .inScope(Scope.EAGER_SINGLETON)
            .onInitialize(function(){
                log.push("initialized");
            }).onDestroy("destroy");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.EAGER_SINGLETON);
            expect(binding.injectionProperties).toEqual({hoge:"var"});
            expect(binding.object).toEqual("test.A");
            expect(binding.module).toEqual("module");
            assertInitializerIsRegistered();
            assertDestructorIsRegistered();
        });
        
        
        it( "can build InstanceBinding.", function() {
            
            builder.toInstance( { foo:"var"} );
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.instance).toEqual({ foo:"var"});
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build InstanceBinding with scope.", function() {
            
            builder.toInstance( { foo:"var"} ).inScope( Scope.EAGER_SINGLETON );
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.EAGER_SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.instance).toEqual({ foo:"var"});
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build InstanceBinding with injection properties.", function() {
            
            builder.toInstance( { foo:"var"} ).withProperties({foo:"var"});
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({foo:"var"});
            expect(binding.instance).toEqual({ foo:"var"});
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build InstanceBinding with initializer.", function() {
            
            builder.toInstance( { foo:"var"} ).onInitialize("init");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.instance).toEqual({ foo:"var"});
            assertInitializerIsRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build InstanceBinding with destructor.", function() {
            
            builder.toInstance( { foo:"var"} ).onDestroy(function(){
                log.push("destroyed");
            });
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.instance).toEqual({ foo:"var"});
            assertInitializerIsNotRegistered();
            assertDestructorIsRegistered();
        });
        
        it( "can build InstanceBinding with all options.", function() {
            
            builder.toInstance( { foo:"var"} )
            .withProperties({hoge:"var"})
            .inScope(Scope.EAGER_SINGLETON)
            .onInitialize(function(){
                log.push("initialized");
            }).onDestroy("destroy");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.EAGER_SINGLETON);
            expect(binding.injectionProperties).toEqual({hoge:"var"});
            expect(binding.instance).toEqual({ foo:"var"});
            assertInitializerIsRegistered();
            assertDestructorIsRegistered();
        });
        
        
        
        
        it( "can build ProviderBinding.", function() {
            
            builder.toProvider( function(){
                return {foo:"var"}
            });
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.provider()).toEqual({ foo:"var"});
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ProviderBinding with scope.", function() {
            
            builder.toProvider( function(){
                return {foo:"var"}
            }).inScope( Scope.EAGER_SINGLETON );
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.EAGER_SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.provider()).toEqual({ foo:"var"});
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ProviderBinding with injection properties.", function() {
            
            builder.toProvider( function(){
                return {foo:"var"}
            }).withProperties({foo:"var"});
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({foo:"var"});
            expect(binding.provider()).toEqual({ foo:"var"});
            assertInitializerIsNotRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ProviderBinding with initializer.", function() {
            
            builder.toProvider( function(){
                return {foo:"var"}
            }).onInitialize("init");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.provider()).toEqual({ foo:"var"});
            assertInitializerIsRegistered();
            assertDestructorIsNotRegistered();
        });
        
        it( "can build ProviderBinding with destructor.", function() {
            
            builder.toProvider( function(){
                return {foo:"var"}
            }).onDestroy(function(){
                log.push("destroyed");
            });
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.SINGLETON);
            expect(binding.injectionProperties).toEqual({});
            expect(binding.provider()).toEqual({ foo:"var"});
            assertInitializerIsNotRegistered();
            assertDestructorIsRegistered();
        });
        
        it( "can build ProviderBinding with all options.", function() {
            
            builder.toProvider( function(){
                return {foo:"var"}
            }).withProperties({hoge:"var"})
            .inScope(Scope.EAGER_SINGLETON)
            .onInitialize(function(){
                log.push("initialized");
            }).onDestroy("destroy");
            
            expect(binding.name).toEqual( "test" );
            expect(binding.id).toBeDefined();
            expect(binding.scope).toBe(Scope.EAGER_SINGLETON);
            expect(binding.injectionProperties).toEqual({hoge:"var"});
            expect(binding.provider()).toEqual({ foo:"var"});
            assertInitializerIsRegistered();
            assertDestructorIsRegistered();
        });
        
        var assertInitializerIsRegistered = function() {
            log = [];
            binding.initialize({
                init : function( ) { log.push("initialized"); }
            });
            expect(log[0]).toEqual("initialized");  
        };
        var assertInitializerIsNotRegistered = function() {
            log = [];
            binding.initialize({
                init : function( ) { log.push("initialized"); }
            });
            expect(log.length).toEqual(0);  
        };
        var assertDestructorIsRegistered = function() {
            log = [];
            binding.destroy({
                destroy : function( ) { log.push("destroyed"); }
            });
            expect(log[0]).toEqual("destroyed");  
        };
        var assertDestructorIsNotRegistered = function() {
            log = [];
            binding.destroy({
                destroy : function( ) { log.push("destroyed"); }
            });
            expect(log.length).toEqual(0);  
        };
        
    });
});