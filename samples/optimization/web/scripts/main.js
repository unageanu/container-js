require.config({
    baseUrl: "scripts",
    paths: {
        "container": "../../../../minified/container"
    }
});
require(["container"], function( ContainerJS ) {
    
    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.A");
        binder.bind("app.B");
        
        binder.bind("app.view.AView").onInitialize("initialize");
        binder.bind("app.view.BView").onInitialize("initialize");
        
        binder.bind("app.model.AModel");
        binder.bind("app.model.BModel");
    });
    
    container.onEagerSingletonConponentsInitialized.then( function() {
        
        document.getElementById("linkA").addEventListener( "click", function(){
            container.get("app.A").then(function( a ){
                a.initialize();
            }, function( error ) {
                alert( error.toString() ); 
            });
        });
        document.getElementById("linkB").addEventListener( "click", function(){
            container.get("app.B").then(function( b ){
                b.initialize();
            }, function( error ) {
                alert( error.toString() ); 
            });
        });
    });
    
});