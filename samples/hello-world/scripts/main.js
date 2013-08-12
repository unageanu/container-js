require.config({
    baseUrl: "scripts",
    paths: {
        "container": "../../../minified/container"
    }
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