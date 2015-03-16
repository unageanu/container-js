define([
  "container",
  "models/events",
  "models/todo",
  "utils/observable"
], function(ContainerJS, Events, Todo, Observable){
    
    "use strict";
    
    /**
     * @class
     */
    var TodoList = function() {
        Observable.apply(this, arguments);
        
        this.timeSource = ContainerJS.Inject;
        
        this.items = [];
        
        Object.seal(this);
    };
    
    TodoList.prototype = new Observable();
    
    /**
     * @public
     */
    TodoList.prototype.load = function( ) {
        this.fire( Events.LOADED, {
           items: this.items
        });
    };
    
    /**
     * @public
     * @param {string} title
     * @return {Todo}
     */
    TodoList.prototype.add = function( title ) {
        
        var todo = Todo.create(this.timeSource, title);
        todo.attachTo(this);
        this.items.push(todo);
        
        this.fire( Events.ADDED, {
           added  : [todo],
           items  : this.items
        });
        
        return todo;
    };
    
    /**
     * @public
     */
    TodoList.prototype.removeCompleted = function() {
        removeItems( this, function(item){
            return item.completed;
        });
    };
    
    /**
     * @public
     * @param {number} id
     */
    TodoList.prototype.removeById = function(id) {
        removeItems( this, function(item){
            return item.id === id;
        });
    };
    
    /** @private */
    var removeItems = function( that, f ) {
        var removed = [];
        that.items = that.items.filter(function(item){
            if (f(item)) {
                removed.push(item);
                return false;
            } else {
                return true;
            }
        });
        if (removed.length > 0) {
            that.fire( Events.REMOVED, {
                items  : that.items,
                removed: removed
            });
        }
    };
    
    return Object.freeze(TodoList);
});