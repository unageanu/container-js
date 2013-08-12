require.config({
    baseUrl: "scripts",
    paths: {
        "container": "../../../minified/container"
    }
});
require(["container"], function( ContainerJS ) {
    
    window.print = function( message ) {
        document.getElementById("console").innerHTML += message + "<br/>";
    };
    
    var container = new ContainerJS.Container( function( binder ){
        
        binder.bind("app.Component");
        
        binder.bindInterceptor( function( jointpoint ) {
           print( "before : " + jointpoint.methodName );
           var result = jointpoint.proceed();
           print( "after : " + jointpoint.methodName );
           return result;
        }, function(binding, component, methodName) {
            if  (binding.name !== "app.Component" ) return false;
            return methodName === "method1"
                     || methodName === "method2";
        } );
    });
    
    container.onEagerSingletonConponentsInitialized.then( function() {
        
        container.get("app.Component").then(function( component ){
            document.getElementById("link1").addEventListener( "click", function(){
                component.method1();
            });
            document.getElementById("link2").addEventListener( "click", function(){
                component.method2();
            });
        }, function( error ) {
            alert( error.toString() ); 
        });
        
    });
    
});