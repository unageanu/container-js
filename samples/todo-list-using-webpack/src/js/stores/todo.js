var sequence = 1;

export default class Todo {
    
    constructor(title, completed=false, now=new Date()) {
    
        this.validateTitle(title);
    
        this.id           = sequence++;
        this.title        = title;
        this.completed    = completed;
        this.createdAt    = now;
        this.lastModified = now;
        this.todoList     = null;
    }
    
    setTitle( value ) {
        this.validateTitle(value);

        this.title        = value;
        this.lastModified = new Date();
    }
    
    complete() {
        this.completed    = true;
        this.lastModified = new Date();
    }
    activate() {
        this.completed    = false;
        this.lastModified = new Date();
    }
    
    remove() {
        if (!this.todoList) throw new Error("illegal state. todoList is not set.");
        this.todoList.removeById( this.id );
    }
    
    attachTo( todoList ) {
        this.todoList = todoList;
    }
    
    validateTitle(title) {
        if (!title) throw new Error("title is not set.");
        if (title.length > 100) throw new Error("title is too long.");
    }
}