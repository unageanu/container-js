define([
    "containerjs/utils/deferred",
    "containerjs/packaging-policy",
    "test/utils/matchers"
], function( Deferred, PackagingPolicy, Matchers ) {
    
    var module = null;
    var loader = {
        load : function() {
            return Deferred.valueOf(module);
        }
    };
    beforeEach(function() {
        jasmine.addMatchers(Matchers);
    });
    
    describe('PackagingPolicy.MODULE_PER_PACKAGE', function() {
        
        var policy = PackagingPolicy.MODULE_PER_PACKAGE;
        beforeEach(function() {
            module = {
                Foo : "Foo",
                Var : "Var"
            };
        });
        
        it( "assumes that the module is defined for each package.", function() {
            expect( policy.resolveModuleFor("com.example.Foo") ).toEqual( "com/example" );
            expect( policy.resolveModuleFor("com.example.test.Foo") ).toEqual( "com/example/test" );
            expect( policy.resolveModuleFor("com.Foo") ).toEqual( "com" );
            
            expect( policy.retrieve( loader, "com.example.Foo" ) ).toResolveWith( "Foo" );
            expect( policy.retrieve( loader, "com.example.test.Var" ) ).toResolveWith( "Var" );
            expect( policy.retrieve( loader, "Foo", "com/example" ) ).toResolveWith( "Foo" );
        });
        
        it( "raises an error when the componentName is not valid.", function() {
            var error = new Error("componentName does not contain a package.");
            expect( policy.retrieve(loader, "com.") ).toRejectWith( error );
            expect( policy.retrieve(loader, ".") ).toRejectWith( error );
            expect( policy.retrieve(loader, "..") ).toRejectWith( error );
            expect( policy.retrieve(loader, "") ).toRejectWith( 
                new Error("componentName is empty string.") );
            expect( policy.retrieve(loader, null) ).toRejectWith( 
                new Error("componentName is null or undefined."));
            expect( policy.retrieve(loader, undefined) ).toRejectWith( 
                new Error("componentName is null or undefined.") );
        });
        
        it( "raises an error when the moduleName is null or empty string.", function() {
            var error = new Error("componentName does not contain a package.");
            expect( policy.retrieve(loader, "Foo") ).toRejectWith( error );
            expect( policy.retrieve(loader, "Foo", null) ).toRejectWith( error );
            expect( policy.retrieve(loader, "Foo", "") ).toRejectWith( error );
        });
        
        it( "raises an error when the component is not defined.", function() {
            expect( policy.retrieve(loader, "com.example.NotFound") ).toRejectWith(
                new Error( "componenet 'com.example.NotFound' is not found in module 'com/example'." ));
        });
        
    });
    
    describe('PackagingPolicy.MODULE_PER_CLASS', function() {
        
        var policy = PackagingPolicy.MODULE_PER_CLASS;
        beforeEach(function() {
            module = "Foo";
        });
        
        it( "assumes that the module is defined for each class.", function() {
            expect( policy.resolveModuleFor("com.example.Foo") ).toEqual( "com/example/foo" );
            expect( policy.resolveModuleFor("com.example.test.FooVar") ).toEqual( "com/example/test/foo-var" );
            expect( policy.resolveModuleFor("com.Foo") ).toEqual( "com/foo" );
            
            expect( policy.retrieve( loader, "com.example.Foo" ) ).toResolveWith( "Foo" );
            expect( policy.retrieve( loader, "com.example.test.Var" ) ).toResolveWith( "Foo" );
            expect( policy.retrieve( loader, "Foo", "com/example" ) ).toResolveWith( "Foo" );
        });
        
        it( "raises an error when the componentName is not valid.", function() {
            expect( policy.retrieve(loader, "") ).toRejectWith( 
                new Error("componentName is empty string.") );
            expect( policy.retrieve(loader, null) ).toRejectWith( 
                new Error("componentName is null or undefined."));
            expect( policy.retrieve(loader, undefined) ).toRejectWith( 
                new Error("componentName is null or undefined.") );
        });
        
        it( "raises an error when the component is not defined.", function() {
            module = null;
            expect( policy.retrieve(loader, "com.example.NotFound") ).toRejectWith(
                new Error( "componenet 'com.example.NotFound' is not found in module 'com/example/not-found'." ));
        });
        
    });
    
    describe('PackagingPolicy.SINGLE_FILE', function() {
        
        var policy = PackagingPolicy.SINGLE_FILE;
        beforeEach(function() {
            module = {
                Foo : "Foo",
                Var : "Var",
                example : {
                    Foo : "example.Foo",
                    test : {
                        Var : "example.test.Var"
                    }
                }
            };
        });
        
        it( "assumes that the module is defined in single file.", function() {
            expect( policy.resolveModuleFor("com.example.Foo") ).toEqual( "com" );
            expect( policy.resolveModuleFor("com.example.test.Foo") ).toEqual( "com" );
            expect( policy.resolveModuleFor("com.Foo") ).toEqual( "com" );
            expect( policy.resolveModuleFor("com") ).toEqual( "com" );
            
            expect( policy.retrieve( loader, "com.example.Foo" ) ).toResolveWith( "example.Foo" );
            expect( policy.retrieve( loader, "com.example.test.Var" ) ).toResolveWith( "example.test.Var" );
            expect( policy.retrieve( loader, "com.Foo", "com" ) ).toResolveWith( "Foo" );
        });
        
        it( "raises an error when the componentName is not valid.", function() {
            expect( policy.retrieve(loader, "") ).toRejectWith( 
                new Error("componentName is empty string.") );
            expect( policy.retrieve(loader, null) ).toRejectWith( 
                new Error("componentName is null or undefined."));
            expect( policy.retrieve(loader, undefined) ).toRejectWith( 
                new Error("componentName is null or undefined.") );
        });
        
        it( "raises an error when the component is not defined.", function() {
            expect( policy.retrieve(loader, "com.NotFound") ).toRejectWith(
                new Error( "componenet 'com.NotFound' is not found in module 'com'." ));
            expect( policy.retrieve(loader, "com.example.NotFound") ).toRejectWith(
                new Error( "componenet 'com.example.NotFound' is not found in module 'com'." ));
            expect( policy.retrieve(loader, "com.example.test.NotFound") ).toRejectWith(
                new Error( "componenet 'com.example.test.NotFound' is not found in module 'com'." ));
        });
        
    });
    
    describe('PackagingPolicy.COMMON_JS_MODULE_PER_CLASS', function() {
        
        var policy = PackagingPolicy.COMMON_JS_MODULE_PER_CLASS;
        beforeEach(function() {
            module = "Foo";
        });
        
        it( "assumes that the module is defined for each class.", function() {
            expect( policy.resolveModuleFor("com.example.Foo") ).toEqual( "./com/example/foo" );
            expect( policy.resolveModuleFor("com.example.test.FooVar") ).toEqual( "./com/example/test/foo-var" );
            expect( policy.resolveModuleFor("com.Foo") ).toEqual( "./com/foo" );
            
            expect( policy.retrieve( loader, "com.example.Foo" ) ).toResolveWith( "Foo" );
            expect( policy.retrieve( loader, "com.example.test.Var" ) ).toResolveWith( "Foo" );
            expect( policy.retrieve( loader, "Foo", "com/example" ) ).toResolveWith( "Foo" );
        });
        
        it( "raises an error when the componentName is not valid.", function() {
            expect( policy.retrieve(loader, "") ).toRejectWith( 
                new Error("componentName is empty string.") );
            expect( policy.retrieve(loader, null) ).toRejectWith( 
                new Error("componentName is null or undefined."));
            expect( policy.retrieve(loader, undefined) ).toRejectWith( 
                new Error("componentName is null or undefined.") );
        });
        
        it( "raises an error when the component is not defined.", function() {
            module = null;
            expect( policy.retrieve(loader, "com.example.NotFound") ).toRejectWith(
                new Error( "componenet 'com.example.NotFound' is not found in module './com/example/not-found'." ));
        });
        
    });
});