define([
  "container",
  "knockout"
], function(ContainerJS, ko){
    
    "use strict";
    
    /**
     * @class
     */
    var TodoInputForm = function() {
        
        this.todoList = ContainerJS.Inject;
        
        this.title = ko.observable("");
        this.titleLength = ko.computed(function(){
            return this.title().length;
        }.bind(this));
        this.error = ko.observable("");
        
        Object.seal(this);
    };
    
    TodoInputForm.prototype.newTodo = function() {
        try {
            this.todoList.add( this.title() );
            this.title("");
            this.error("");
        } catch ( exception ) {
            this.error(exception.message);
        }
    };

    return Object.freeze(TodoInputForm);
});