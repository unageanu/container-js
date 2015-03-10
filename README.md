[![Build Status](https://travis-ci.org/unageanu/container-js.svg?branch=master)](https://travis-ci.org/unageanu/container-js)
[![Code Climate](https://codeclimate.com/github/unageanu/container-js/badges/gpa.svg)](https://codeclimate.com/github/unageanu/container-js)

# About

ContainerJS is a Dependency Injection Container for JavaScript Application.

# Features

- **Dependency Resolution and Injection**
 - ContainerJS is responsible for the generation of container-managed objects, and the resolution and injection of its dependent components.
     - You can specify a dependency in the component definition by JavaScript code, or can be defined declaratively in the class.
     - Since there is no interface in JavaScript, dependency resolution is done in the name assigned to the component.
 - By using the dependency injection container, you can automate the wiring.
 - Because of the component is cached by the container, you can reduce the generation of unnecessary objects.

- **Lazy Module Loading**
 - It loads the required modules lazily and asynchronously by working with the require.js.
 - Until the component is actually used by the user's operation or the like, you can delay the loading and evaluation of the JavaScript source.

- **Supports Aspect Oriented Programing**
 - You can weave a method interceptor to a container-managed component.
 - You can aggregate a cross-class features like a performance measurement, into the interceptor.

# License
[New BSD License](http://opensource.org/licenses/BSD-3-Clause) 

# Dependent Libraries

ContainerJS is dependent on the following modules.

- [RequireJS](http://requirejs.org/) ( [New BSD or MIT License](https://github.com/jrburke/requirejs/blob/master/LICENSE) )

In addition, we use the following testing framework.

- [jasmine](https://github.com/pivotal/jasmine/) ( [MIT License](https://github.com/pivotal/jasmine/blob/master/MIT.LICENSE) )

# Support Browsers

- IE9+
- GoogleChrome
- Firefox4+
- IE7,8 with es5-shim ( https://github.com/kriskowal/es5-shim )

# Getting Started

Here is an example of the "Hello World". Please also see 'samples/hello-world'.

file layout:

- index.html
- scripts/
    - main.js
    - require.js
    - container.js
    - app/
        - model.js
        - view.js
    - utils/
        - observable.js

scripts/app/model.js:

    define(["utils/observable"], function(Observable){
    
         "use strict";
    
         /**
         * @class
         */
        var Model = function() {};
        
        Model.prototype = new Observable();
        
        /**
         * @public
         */
        Model.prototype.initialize = function() {
            this.fire( "updated", { 
                property: "message", 
                value :"hello world."
            });
        };
    
        return Model;
    });

scripts/app/view.js:

    define(["container"], function( ContainerJS ){
        
        "use strict";
        
        /**
         * @class
         */
        var View = function() {
            this.model = ContainerJS.Inject("app.Model");
        };
        
        /**
         * @public
         */
        View.prototype.initialize = function() {
            this.model.addObserver("updated", function( ev ) {
                if ( ev.property != "message" ) return;
                var e = document.getElementById(this.elementId);
                e.innerHTML = ev.value; 
            }.bind(this));
        };
        
        return View;
    });

scripts/app/main.js:

    require.config({
        baseUrl: "scripts",
    });
    require(["container"], function( ContainerJS ) {
        
        var container = new ContainerJS.Container( function( binder ){
            
            binder.bind("app.View").withProperties({
                elementId : "console"
            }).onInitialize("initialize")
            .inScope(ContainerJS.Scope.EAGER_SINGLETON);
            
            binder.bind("app.Model");
            
        });
        container.onEagerSingletonConponentsInitialized.then(function() {
            container.get("app.Model").then(function( model ){
                model.initialize();
            }, function( error ) {
                alert( error.toString() ); 
            });
        });
        
    });

index.html:

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Hello World</title>
        <script type="text/javascript" data-main="scripts/main.js" src="scripts/require.js"></script>
      </head>
      <body>
        <div id="console"></div>
      </body>
    </html>

# References

## Binding

Supports the binding of components by the following 5 ways.

- Class Binding
- Prototype Binding
- Object Binding
- Provider Binding
- Instance Binding

### Class Binding

- Specifies a class (same as a constructor function) to a component.
- The object that is created by the `new` operator will be the component.
- The constructor function is load asynchronously using the require.js's `require()`.
- You can specify an argument passed to the constructor function by using `withConstructorArgument()`.

Component Definition:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.Class");
        binder.bind("anotherName").to("app.Class").withConstructorArgument({
            foo:"foo",
            var:ContainerJS.Inject("app.Class") // Dependency injection can also
        });
    });

app/class.js:

    define(function(){
        /**
         * @class
         */
        var Class = function(arg) { 
            this.foo = args.foo;
            this.var = args.var;
        };
        return Class;
    });


### Prototype Binding

- Specifies a prototype to a component.
- The object that is created by `Object#create(<prototype>)` will be the component.
- The prototype is load asynchronously using the require.js's `require()`.

Component Definition:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.Prototype").asPrototype();
        binder.bind("anotherName").toPrototype("app.Prototype", {
           foo : { value: "foo" } // You can specify the arguments to be passed to `Object#Create()` in the second argument.
        });
    });

app/prototype.js:

    define(function(){
        /**
         * @class
         */
        var Prototype = {
            method : function( arg ) {
                return arg;
            }
        }
        return Prototype;
    });

### Object Binding

- The object that loaded by requirejs's "require" will be a component.

Component Definition:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.Object").asObject();
        binder.bind("anotherName").toObject("app.Object");
    });

app/object.js:

    define(function(){
        var Obj = {
            method : function( arg ) {
                return arg;
            }
        }
        return Obj;
    });


### Provider Binding

- Specifies a function to generate the component.
- The function's return value will be the component.

Component Definition:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("name").toProvider(function(){
            return "foo";
        });
    });

### Instance Binding

- Specifies the component itself.

Component Definition:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("name").toInstance("foo");
    });

## Packaging Policy

By setting the Packaging Policy, where you can control the loading of modules.

### MODULE\_PER\_CLASS

This Is the default policy. It assumes that the module are separated per class.
A Component is loaded from `<A class name "-" was separated>.js` following the same path as the namespace.

file layout:

- app/
    - foo/
        - hoge-hoge.js
        - fuga-fuga.js
- main.js

app/foo/hoge-hoge.js:

    define(function(){
        /**
         * @class
         */
        var HogeHoge = function(arg) {};
        return HogeHoge;
    });

app/foo/fuga-fuga.js:

    define(function(){
        /**
         * @class
         */
        var FugaFuga = function(arg) {};
        return FugaFuga;
    });

main.js:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.foo.HogeHoge");
        binder.bind("app.foo.FugaFuga");
    });

### MODULE\_PER\_PACKAGE

It assumes that the module are separated per package.

file layout:

- app/
    - foo.js
- main.js

app/foo.js:

    define(function(){
    
        /**
         * @class
         */
        var HogeHoge = function(arg) {};
        
        /**
         * @class
         */
        var FugaFuga = function(arg) {};
        
        return {
            HogeHoge : HogeHoge,
            FugaFuga : FugaFuga
        }
    });

main.js:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.foo.HogeHoge")
            .assign(ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE);
        binder.bind("app.foo.FugaFuga")
            .assign(ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE);
    });

### SINGLE\_FILE

It assumes that all of the classes in a namespace are defined into a single file.

file layout:

- app.js
- main.js

app.js:

    define(function(){
    
        /**
         * @class
         */
        var HogeHoge = function(arg) {};
        
        /**
         * @class
         */
        var FugaFuga = function(arg) {};
        
        return {
            foo : {
                HogeHoge : HogeHoge,
                FugaFuga : FugaFuga
            }
        }
    });

main.js:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.foo.HogeHoge")
            .assign(ContainerJS.PackagingPolicy.SINGLE_FILE);
        binder.bind("app.foo.FugaFuga")
            .assign(ContainerJS.PackagingPolicy.SINGLE_FILE);
    });

In addition to be specified in the component definition, The default packaging policy can also be specified in the constructor arguments of the container.

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.foo.HogeHoge");
        binder.bind("app.foo.FugaFuga");
    }, ContainerJS.PackagingPolicy.SINGLE_FILE); // specified the default settings by the constructor arguments.

## Scope

Supports the "Singleton", "EagerSingleton", "Prototype".  the "Singleton" is the default.

- **Singleton**
    - Creates only one component.
    - If you get the same component multiple times, the same component will return always.
    - The Components are discarded by `Container#destroy()`.
- **EagerSingleton**
    - Will return the single instance of like Singleton, an instance will be created when creating the container.
    - You can create a component to be effective only to be registered into the container.
- **Prototype**
    - Each time you get a component, and then re-create the component.

Configuration change is done in the `inScope()` .

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("Foo").inScope( ContainerJS.Scope.SINGLETON ); // default
        binder.bind("Bar").inScope( ContainerJS.Scope.EAGER_SINGLETON );
        binder.bind("Val").inScope( ContainerJS.Scope.PROTOTYPE );
    });
    container.onEagerSingletonConponentsInitialized.then(function(){
        // called when all eager singleton conponents are initialized.
    });

## Injection

If you set a `ContainerJS.Inject` to the property, the dependent module is searched and Injected by the container.

- Setting a `ContainerJS.Inject`, a component will be searched by the property name.
- Using `ContainerJS.Inject(name)` , You can explicitly specify the name of the component to search.
- Setting a `ContainerJS.Inject.all` or `ContainerJS.Inject.all(name)` , An array of components with the specified name will be injected.
- Setting a `ContainerJS.Inject.lazily`,`ContainerJS.Inject.lazily(name)`,`ContainerJS.Inject.all.lazily`,`ContainerJS.Inject.all.lazily(name)`,  Component(s) to be injected will then be load lazily.
  - Instead the component, Deferred in order to get the component is injected.

Example:

    define(["container"], function(ContainerJS){
        /**
         * @class
         */
        var Class = function() { 
            this.a = ContainerJS.Inject;
            this.b = ContainerJS.Inject("foo.var");
            this.c = ContainerJS.Inject.all;
            this.d = ContainerJS.Inject.all("foo.var");
            this.e = ContainerJS.Inject.lazily;
            this.f = ContainerJS.Inject.all.lazily("foo.bal");
        };
        Class.prototype.method1 = {
            this.e.then( function(component) {
                // 
            }, function(error) {
                // 
            } )
        };
        return Class;
    });

You can also be injected at the time of the component definition.

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("Foo").withProperties({
            a : ContainerJS.Inject("foo.var")
        }).withConstructorArgument({
            b : ContainerJS.Inject.all.lazily("foo.bal")
        });
    });

## Initialization and Destruction

You can register a function to be called when creating and destroying components.

- Initialization function is executed after when all of creation phases are completed.
- Destruct function is executed when `container.Container#destroy()` is called if the following conditions are met.
  - the scope of the component is Singleton or EagerSingleton.
  - the component is already created.
- You can specify the functions by the component method name or a function.
  - If you specify a function, components and containers will be passed as an argument.

Example:

    var c = new ContainerJS.Container( function( binder ) {
        
        // specifies the component method name.
        binder.bind( "Foo" ).onInitialize("initialize").onDestroy("dispose");

        // specifies a function.
        binder.bind( "Bar" ).onInitialize( function( component, container ) {
            component.initialize();
        }).onDestroy( function( component, container ) {
            component.dispose();
        });
    
    });

### Method Interception

You can weave an interceptor to a method of the component.

- The interceptor would be specified in the function. an object that contains the method name and arguments is passed in the argument.
- you can specify a function to indicate the components and methods to be applied the interceptor in the second argument.
  - If the second argument is not explicitly specified, the interceptor applies to all methods of all components.

Example:

        var container = new ContainerJS.Container( function( binder ){
            
            binder.bind("app.Component");
            
            binder.bindInterceptor( function( jointpoint ) {
               jointpoint.methodName;
               jointpoint.self;
               jointpoint.arguments; // Arguments. Can be modified.
               jointpoint.context; // You can store the state that is shared between the invocation of this method.
               return jointpoint.proceed(); // Returns the result of calling the original method.
            }, function(binding, component, methodName) {
                if  (binding.name !== "app.Component" ) return false;
                return methodName === "method1"
                       || methodName === "method2";
            } );
        });
