define([
  "container",
  "knockout",
  "models/events",
  "viewmodels/todo-view"
], function(ContainerJS, ko, Events, TodoView){
    
    "use strict";
    
    /**
     * @class
     */
    var TodoListView = function() {
        
        this.todoList = ContainerJS.Inject;
        this.todoInputForm = ContainerJS.Inject;
        
        this.items = ko.observableArray();
        
        this.numberOfCompleted = ko.observable(0);
        this.enableToRemoveCompleted = ko.computed(function(){
            return this.numberOfCompleted() > 0;
        }.bind(this));
        
        Object.seal(this);
    };
    
    TodoListView.prototype.initialize = function(){
        this.todoList.addObserver( Events.LOADED,  this.onLoad.bind(this) );
        this.todoList.addObserver( Events.ADDED,   this.onAdded.bind(this) );
        this.todoList.addObserver( Events.REMOVED, this.onRemoved.bind(this) );
    };
    
    
    TodoListView.prototype.newTodo = function() {
        this.todoInputForm.newTodo();
    };
    TodoListView.prototype.removeCompleted = function(event) {
        this.todoList.removeCompleted();
    };
    
    
    TodoListView.prototype.onLoad = function(event) {
        this.items(event.items.map(function(todo){
            this.addObserverToTodo(todo);
            return new TodoView(todo);
        }.bind(this)));
    };
    
    TodoListView.prototype.onAdded = function(event) {
        event.added.forEach( function( todo ) {
            this.addObserverToTodo(todo);
            this.updateNumberOfCompleted( todo.completed ? 1 : 0 );
            this.items.push(new TodoView(todo));
        }.bind(this)); 
    };
    
    TodoListView.prototype.onRemoved = function(event) {
        var removedIds = {};
        event.removed.forEach( function( todo ) {
            this.updateNumberOfCompleted( todo.completed ? -1 : 0 );
            removedIds[todo.id] = true;
        }.bind(this));
        this.items.remove( function(item) {
            return removedIds[item.model.id];
        });
    };
    
    /** @private */
    TodoListView.prototype.addObserverToTodo = function(todo){
        todo.addObserver( Events.UPDATED, this.onTodoUpdated.bind(this));
    };
    
    /** @private */
    TodoListView.prototype.onTodoUpdated = function(event){
       if (event.propertyName === "completed") {
           if (event.newValue !== event.oldValue) {
               this.updateNumberOfCompleted( event.newValue ? 1 : -1 );
           }
       }
    };
    
    /** @private */
    TodoListView.prototype.updateNumberOfCompleted = function(count){
       this.numberOfCompleted( this.numberOfCompleted()+count );
    };
    
    return Object.freeze(TodoListView);
});