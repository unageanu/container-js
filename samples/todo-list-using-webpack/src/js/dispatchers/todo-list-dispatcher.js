import ContainerJS from 'container-js';

export default class TodoListDispatcher {
    
    constructor() {
        this.callbacks = {};
        
        this.todoList = ContainerJS.Inject;
    }
    
    initialize() {
        this.registerCallbacks();
    }
    
    dispatch(payload) {
        const callback = this.callbacks[payload.actionType];
        if (callback) callback(payload);
    }
    
    registerCallbacks() {
        this.callbacks["add"] = 
            (payload) => this.todoList.add(payload.title);
        this.callbacks["removeCompleted"] = 
            (payload) => this.todoList.removeCompleted();
        
        this.callbacks["complete"] = (payload) => {
            let todo = this.todoList.get(payload.id);
            if (todo) todo.complete();
        };
        this.callbacks["activate"] =  (payload) => {
            let todo = this.todoList.get(payload.id);
            if (todo) todo.activate();
        };
        this.callbacks["remove"] =  (payload) => {
            let todo = this.todoList.get(payload.id);
            if (todo) todo.remove();
        };
    }
} 

