define([
    "containerjs/binding-builders",
    "containerjs/scope",
    "containerjs/inject",
    "containerjs/packaging-policy",
    "containerjs/utils/deferred"
], function(builders, Scope, Inject, PackagingPolicy, Deferred) {
    
    var binding = null;
    var reference = {
        set : function(b){
            binding = b;
        },
        get : function(){
            return binding;
        }
    };
    var module = {
        A : function( arg ) {
            this.arg = arg;
        },
        B : {},
        C : {},
        ErrorConstructor : function() {
            throw new Error("test");
        }
    };
    var container = {
        get : function( name ){
            return Deferred.valueOf( name );
        },
        loader : {
            load : function( moduleName ) {
                return Deferred.valueOf( module );
            }
        }
    };
    
    describe('ConstructorBinding', function() {
        
        var builder = null;
        
        beforeEach(function() {
            binding = { 
                name:"test", 
                packagingPolicy:PackagingPolicy.MODULE_PER_PACKAGE 
            };
            builder = Object.create( builders.RootBuilder, { 
                reference : { 
                    value : reference 
                }
            });
        });
        
        it( "can create Component.", function() {
            
            builder.to( "test.A" ).withConstructorArgument({ 
                value:"value1",
                value2: Inject,
                value3: Inject( "componentB" ),
                value4: Inject.lazily,
                value5: Inject.lazily("componentC")
            }).withProperties({ 
                value:"value1",
                value2: Inject,
                value3: Inject( "componentB" ),
                value4: Inject.lazily,
                value5: Inject.lazily("componentC")        
            }).onInitialize(function(component, container){
                component.initialized = true;
            });
            
            var binding = reference.get();
            var component = Deferred.unpack(binding.getInstance( container ));
            binding.initialize( component, container );
            
            expect(component instanceof module.A ).toBe( true );
            expect(component.arg.value).toEqual( "value1" );
            expect(component.arg.value2).toEqual( "value2" );
            expect(component.arg.value3).toEqual( "componentB" );
            expect(Deferred.unpack(component.arg.value4)).toEqual( "value4" );
            expect(Deferred.unpack(component.arg.value5)).toEqual( "componentC" );
            expect(component.value).toEqual( "value1" );
            expect(component.value2).toEqual( "value2" );
            expect(component.value3).toEqual( "componentB" );
            expect(Deferred.unpack(component.value4)).toEqual( "value4" );
            expect(Deferred.unpack(component.value5)).toEqual( "componentC" );
            expect(component.initialized).toBe( true );
        });
        
        it( "raises an error if the constructor is not found.", function() {
            
            builder.to( "test.NotFound" );
            
            var binding = reference.get();
            expect( function() {
                Deferred.unpack(binding.getInstance( container ));
            }).toThrow( new Error("componenet 'test.NotFound' is not found in module 'test'.") );
        });
        
        it( "raises an error if the constructor is not function.", function() {
            
            builder.to( "test.B" );
            
            var binding = reference.get();
            expect( function() {
                Deferred.unpack(binding.getInstance( container ));
            }).toThrow( );
        });
        
        it( "raises an error if the constructor raises an error.", function() {
            
            builder.to( "test.ErrorConstructor" );
            
            var binding = reference.get();
            expect( function() {
                Deferred.unpack(binding.getInstance( container ));
            }).toThrow( new Error("test") );
        });
    });
    
    describe('PrototypeBinding', function() {
        
        var builder = null;
        
        beforeEach(function() {
            binding = { 
                name:"test", 
                packagingPolicy:PackagingPolicy.MODULE_PER_PACKAGE 
            };
            builder = Object.create( builders.RootBuilder, { 
                reference : { 
                    value : reference 
                }
            });
        });
        
        it( "can create Component.", function() {
            
            builder.toPrototype( "test.B", { 
                value11: { value : "value1", writable: true, enumerable: true },
                value12: { value : Inject, writable: true, enumerable: false },
                value13: { value : Inject( "componentB" ) },
                value14: { value : Inject.lazily },
                value15: { value : Inject.lazily("componentC") }
            }).withProperties({ 
                value:"value1",
                value2: Inject,
                value3: Inject( "componentB" ),
                value4: Inject.lazily,
                value5: Inject.lazily("componentC")        
            }).onInitialize(function(component, container){
                component.initialized = true;
            });
            
            var binding = reference.get();
            var component = Deferred.unpack(binding.getInstance( container ));
            binding.initialize( component, container );
            
            expect(module.B.isPrototypeOf( component ) ).toBe( true );
            expect(component.value11).toEqual( "value1" );
            expect(component.value12).toEqual( "value12" );
            expect(component.value13).toEqual( "componentB" );
            var value11PropertyDescriptor = Object.getOwnPropertyDescriptor( component, "value11" );
            expect(value11PropertyDescriptor.writable).toEqual( true );
            expect(value11PropertyDescriptor.enumerable).toEqual( true );
            var value12PropertyDescriptor = Object.getOwnPropertyDescriptor( component, "value12" );
            expect(value12PropertyDescriptor.writable).toEqual( true );
            expect(value12PropertyDescriptor.enumerable).toEqual( false );
            var value13PropertyDescriptor = Object.getOwnPropertyDescriptor( component, "value13" );
            expect(value13PropertyDescriptor.writable).toEqual( false );
            expect(value13PropertyDescriptor.enumerable).toEqual( false );
            expect(Deferred.unpack(component.value14)).toEqual( "value14" );
            expect(Deferred.unpack(component.value15)).toEqual( "componentC" );
            expect(component.value).toEqual( "value1" );
            expect(component.value2).toEqual( "value2" );
            expect(component.value3).toEqual( "componentB" );
            expect(Deferred.unpack(component.value4)).toEqual( "value4" );
            expect(Deferred.unpack(component.value5)).toEqual( "componentC" );
            expect(component.initialized).toBe( true );
        });
        
        it( "raises an error if the prototype is not found.", function() {
            
            builder.toPrototype( "test.NotFound" );
            
            var binding = reference.get();
            expect( function() {
                Deferred.unpack(binding.getInstance( container ));
            }).toThrow( new Error("componenet 'test.NotFound' is not found in module 'test'.") );
        });
        
        it( "raises an error if fail to create an Object.", function() {
            
            builder.toPrototype( "test.B", {foo: "var"});
            
            var binding = reference.get();
            expect( function() {
                Deferred.unpack(binding.getInstance( container ));
            }).toThrow( );
        });
    });
    
    describe('ObjectBinding', function() {
        
        var builder = null;
        
        beforeEach(function() {
            binding = { 
                name:"test", 
                packagingPolicy:PackagingPolicy.MODULE_PER_PACKAGE 
            };
            builder = Object.create( builders.RootBuilder, { 
                reference : { 
                    value : reference 
                }
            });
        });
        
        it( "can create Component.", function() {
            
            builder.toObject( "test.C").withProperties({ 
                value:"value1",
                value2: Inject,
                value3: Inject( "componentB" ),
                value4: Inject.lazily,
                value5: Inject.lazily("componentC")        
            }).onInitialize(function(component, container){
                component.initialized = true;
            });
            
            var binding = reference.get();
            var component = Deferred.unpack(binding.getInstance( container ));
            binding.initialize( component, container );
            

            expect(component).toBe(module.C);
            expect(component.value).toEqual("value1");
            expect(component.value2).toEqual("value2");
            expect(component.value3).toEqual("componentB");
            expect(Deferred.unpack(component.value4)).toEqual("value4");
            expect(Deferred.unpack(component.value5)).toEqual("componentC");
            expect(component.initialized).toBe(true);
        });
        
        it( "raises an error if the object is not found.", function() {
            
            builder.toObject( "test.NotFound" );
            
            var binding = reference.get();
            expect( function() {
                Deferred.unpack(binding.getInstance( container ));
            }).toThrow( new Error("componenet 'test.NotFound' is not found in module 'test'.") );
        });
        
    });

    describe('InstanceBinding', function() {
        
        var builder = null;
        
        beforeEach(function() {
            binding = { 
                name:"test", 
                packagingPolicy:PackagingPolicy.MODULE_PER_PACKAGE 
            };
            builder = Object.create( builders.RootBuilder, { 
                reference : { 
                    value : reference 
                }
            });
        });
        
        it( "can create Component.", function() {
            
            var instance = {};
            
            builder.toInstance(instance).withProperties({
                value : "value1",
                value2 : Inject,
                value3 : Inject("componentB"),
                value4 : Inject.lazily,
                value5 : Inject.lazily("componentC")
            }).onInitialize(function(component, container) {
                component.initialized = true;
            });

            var binding = reference.get();
            var component = Deferred.unpack(binding.getInstance(container));
            binding.initialize(component, container);

            expect(component).toBe(instance);
            expect(component.value).toEqual("value1");
            expect(component.value2).toEqual("value2");
            expect(component.value3).toEqual("componentB");
            expect(Deferred.unpack(component.value4)).toEqual("value4");
            expect(Deferred.unpack(component.value5)).toEqual("componentC");
            expect(component.initialized).toBe(true);
        });
    });
    
    describe('ProviderBinding', function() {
        
        var builder = null;
        
        beforeEach(function() {
            binding = { 
                name:"test", 
                packagingPolicy:PackagingPolicy.MODULE_PER_PACKAGE 
            };
            builder = Object.create( builders.RootBuilder, { 
                reference : { 
                    value : reference 
                }
            });
        });
        
        it( "can create Component.", function() {
            
            var instance = {};
            var provider = function(){ return instance; };
            
            builder.toProvider(provider).withProperties({
                value : "value1",
                value2 : Inject,
                value3 : Inject("componentB"),
                value4 : Inject.lazily,
                value5 : Inject.lazily("componentC")
            }).onInitialize(function(component, container) {
                component.initialized = true;
            });

            var binding = reference.get();
            var component = Deferred.unpack(binding.getInstance(container));
            binding.initialize(component, container);

            expect(component).toBe(instance);
            expect(component.value).toEqual("value1");
            expect(component.value2).toEqual("value2");
            expect(component.value3).toEqual("componentB");
            expect(Deferred.unpack(component.value4)).toEqual("value4");
            expect(Deferred.unpack(component.value5)).toEqual("componentC");
            expect(component.initialized).toBe(true);
        });
        
        it( "can specifies null as instance.", function() {
            
            var provider = function(){ return null; };
            builder.toProvider(provider);
            
            var binding = reference.get();
            var component = Deferred.unpack(binding.getInstance(container));
            binding.initialize(component, container);

            expect(component).toBeNull();
        });
    });
});