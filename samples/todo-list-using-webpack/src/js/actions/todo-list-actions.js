import ContainerJS from 'container-js';

export default class TodoListActions {
    
    constructor() {
        this.callbacks = {};
        
        this.dispatcher = ContainerJS.Inject;
    }
    
    add(title) {
        this.dispatcher.dispatch({
            actionType: "add",
            title:       title
        });
    }
    
    removeCompleted() {
        this.dispatcher.dispatch({
            actionType: "removeCompleted"
        });
    }
    
    complete(id) {
        this.dispatcher.dispatch({
            actionType: "complete",
            id:         id
        });
    }
    
    activate(id) {
        this.dispatcher.dispatch({
            actionType: "activate",
            id:         id
        });
    }
    
    remove(id) {
        this.dispatcher.dispatch({
            actionType: "remove",
            id:         id
        });
    }
} 

