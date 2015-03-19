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
    var TodoView = function(todo) {
        
        this.model = todo;
        
        this.title        = ko.observable(todo.title);
        this.completed    = ko.observable(todo.completed);
        this.createdAt    = ko.observable(todo.createdAt);
        this.lastModified = ko.observable(todo.lastModified);
        
        this.createdAtForDisplay = ko.computed(function(){
            return formatDate(this.createdAt());
        }.bind(this));
        this.lastModifiedForDisplay = ko.computed(function(){
            return formatDate(this.lastModified());
        }.bind(this));
        
        this.addObservers();
        
        Object.seal(this);
    };
    
    TodoView.prototype.addObservers = function(){
        this.model.addObserver( Events.UPDATED, this.onUpdated.bind(this) );
    };
    
    
    TodoView.prototype.remove = function() {
        this.model.remove();
    };
    TodoView.prototype.complete = function(event) {
        this.model.complete();
    };
    TodoView.prototype.activate = function(event) {
        this.model.activate();
    }
    
    
    TodoView.prototype.onUpdated = function(event) {
        this[event.propertyName](event.newValue);
    };
    
    var formatDate = function(d){
        if (!d) return "";
        return d.getFullYear() 
                + "-" + (d.getMonth() + 1) 
                + "-" + d.getDate()
                + " " + d.getHours()
                + ":" + d.getMinutes()
                + ":" + d.getSeconds();
    };
    
    return Object.freeze(TodoView);
});