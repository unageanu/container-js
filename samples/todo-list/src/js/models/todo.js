define([
    "models/events",
    "utils/observable"
], function(Events, Observable){
    
    "use strict";
    
    var sequence = 1;
    
    /**
     * @class
     */
    var Todo = function(timeSource) {
        Observable.apply(this, arguments);
        
        var now = timeSource.now();
        
        this.id           = sequence++;
        this.title        = "";
        this.completed    = false;
        this.createdAt    = now;
        this.lastModified = now;
        
        this.timeSource = timeSource;
        this.todoList = null;
        
        Object.seal(this);
    };
    
    Todo.prototype = new Observable();
    
    /**
     * @public
     * @return {string}
     */
    Todo.prototype.setTitle = function( title ) {
        validateTitle(title);
        update(this, "title", title);
        update(this, "lastModified", this.timeSource.now());
    };
    
    /**
     * @public
     */
    Todo.prototype.complete = function() {
        update(this, "completed", true);
        update(this, "lastModified", this.timeSource.now());
    };
    
    /**
     * @public
     */
    Todo.prototype.activate = function() {
        update(this, "completed", false);
        update(this, "lastModified", this.timeSource.now());
    };
    
    /**
     * @public
     */
    Todo.prototype.remove = function() {
        if (!this.todoList) throw new Error("illegal state. todoList is not set.");
        this.todoList.removeById( this.id );
    };
    
    /** @private */
    Todo.prototype.attachTo = function( todoList ) {
        this.todoList = todoList;
    };
    
    /**
     * @public
     * @param {TimeSource} timeSource
     * @param {string} title
     * @param {boolean?} completed
     * @param {Date?} createdAt
     * @param {Date?} lastModified
     */
    Todo.create = function( timeSource, title, 
            completed, createdAt, lastModified ) {
        
        validateTitle(title);
        
        var now  = timeSource.now();
        var todo = new Todo(timeSource);
        
        todo.title        = title;
        todo.completed    = completed || false;
        todo.createdAt    = createdAt || now;
        todo.lastModified = lastModified || now;
        
        return todo;
    };
    
    /** @private */
    var update = function(that, propertyName, newValue) {
        var oldValue = that[propertyName];
        that[propertyName] = newValue;
        that.fire(Events.UPDATED, {
            propertyName : propertyName,
            newValue     : newValue,
            oldValue     : oldValue
        });
    };
    /** @private */
    var validateTitle = function(title) {
        if (!title) throw new Error("title is not set.");
        if (title.length > 100) throw new Error("title is too long.");
    };
    
    return Object.freeze(Todo);
});