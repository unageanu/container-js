import ContainerJS from 'container-js';
import Todo        from './todo';

export default class TodoList {
    
    constructor() {
        this.items = [];
    }
    
    get( id ) { 
        for ( let item of this.items ){
            if (item.id === id) return item;
        }
    }
    add( title ) { 
        const todo = new Todo(title);
        todo.attachTo(this);
        this.items.push(todo);
        return todo;
    }
    removeCompleted() {
        this.items = this.items.filter( item => !item.completed );
    }
    removeById(id) {
        this.items = this.items.filter( item => item.id !== id );
    }
}