define(["container"], function( ContainerJS ) {
    
    "use strict";
    
    var models = function( binder ){
        binder.bind("todoList").to("models.TodoList");
        binder.bind("timeSource").to("models.TimeSource");
    };
    
    var viewmodels = function( binder ){
        binder.bind("todoListView").to("viewmodels.TodoListView").onInitialize("initialize");
        binder.bind("todoInputForm").to("viewmodels.TodoInputForm");
    };
    
    var modules = function( binder ){
        models(binder);
        viewmodels(binder);
    };
    
    return modules;
});