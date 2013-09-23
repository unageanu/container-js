require.config({
    baseUrl: "../js",
    paths: {
        "container" : "../../../../minified/container",
        "knockout"  : "knockout-2.3.0"
    }
});
require([
  "container",
  "knockout",
  "composing/modules",
  
  "models/time-source",
  "models/todo-list",
  "models/todo",
  "viewmodels/todo-input-form",
  "viewmodels/todo-list-view",
  "viewmodels/todo-view"
], function( ContainerJS, ko, modules ) {
    
    var container = new ContainerJS.Container( modules );
    container.get("todoListView").then(function( viewModel ){
        ko.applyBindings(viewModel);
    }, function( error ) {
        alert( error.toString() ); 
    });
    
});