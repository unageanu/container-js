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
        binder.bind("app.Owner");
    });
    
    container.onEagerSingletonConponentsInitialized.then(function() {
        
        container.get("app.Owner").then(function( owner ){
            document.getElementById("link").addEventListener( "click", function(){
                owner.initialize();
            });
        }, function( error ) {
            alert( error.toString() ); 
        });
        
    });
    
});