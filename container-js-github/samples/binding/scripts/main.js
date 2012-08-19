require.config({
    baseUrl: "scripts",
    paths: {
        "container": "../../../minified/container"
    }
});
require([
    "container",
    "app/class",
    "app/prototype",
    "app/object"
], function( ContainerJS, Class, Prototype, Obj ) {
    
    window.print = function( message ) {
        document.getElementById("console").innerHTML += message + "<br/>";
    };
    
    var container = new ContainerJS.Container( function( binder ){
        
        binder.bind("app.Class");
        binder.bind("app.Prototype").asPrototype();
        binder.bind("app.Object").asObject();
        
        binder.bind("instance").toInstance("foo");
        binder.bind("provider").toProvider(function( container ){
            return "var";
        });
        
    });
    
    window.addEventListener("load", function() {
        
        container.get("app.Class").then(function( component ){
            print( "<br/>--- app.Class" );
            print( "component === app.Class : " + (component === Class) );
            print( "component instanceof app.Class : " + (component instanceof Class) );
            print( "app.Class.isPrototypeOf( component ) : " + (Class.isPrototypeOf(component)) );
        }, function( error ) {
            alert( error.toString() ); 
        });
        
        container.get("app.Prototype").then(function( component ){
            print( "<br/>--- app.Prototype" );
            print( "component === app.Prototype : " + (component === Prototype) );
            print( "app.Prototype.isPrototypeOf( component ) : " + (Prototype.isPrototypeOf(component)) );
        }, function( error ) {
            alert( error.toString() ); 
        });
        
        container.get("app.Object").then(function( component ){
            print( "<br/>--- app.Object" );
            print( "component === app.Object : " + (component === Obj) );
            print( "app.Obj.isPrototypeOf( component ) : " + (Obj.isPrototypeOf(component)) );
        }, function( error ) {
            alert( error.toString() ); 
        });
        
        container.get("instance").then(function( component ){
            print( "<br/>--- instance" );
            print( component );
        }, function( error ) {
            alert( error.toString() ); 
        });
        
        container.get("provider").then(function( component ){
            print( "<br/>--- provider" );
            print( component );
        }, function( error ) {
            alert( error.toString() ); 
        });
        
    }, false);
    
});