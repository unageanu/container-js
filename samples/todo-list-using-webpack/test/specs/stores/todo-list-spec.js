import TodoList from '../../../src/js/stores/todo-list';

describe('TodoList', () => {
    
    let todoList;
    let events = [];

    beforeEach( () => {
        todoList = new TodoList();
    });
    
    afterEach(() => {
        events = [];
    });
    
    describe('get', () => {
        it( "can retrieve a todo by id.", () => {
            const todo = todoList.add("test1");

            expect( todoList.get(todo.id) ).toBe( todo );
        });
    });
    
    describe('add', () => {
        it( "creates and add a new todo.", () => {
            todoList.add("test1");
            
            expect( todoList.items.length ).toEqual( 1 );
            expect( todoList.items[0].title ).toEqual( "test1" );
            
            todoList.add("test2");
            
            expect( todoList.items.length ).toEqual( 2 );
            expect( todoList.items[0].title ).toEqual( "test1" );
            expect( todoList.items[1].title ).toEqual( "test2" );
        });
    });
    
    describe('removeById', () => {
        
        let items = [];
        
        beforeEach( () => {
            items.push(todoList.add("test1"));
            items.push(todoList.add("test2"));
            items.push(todoList.add("test3"));
        });
        
        it( "can removes todos by id.", () => {
            expect( todoList.items.length ).toEqual( 3 );
            expect( todoList.items[0].title ).toEqual( "test1" );
            expect( todoList.items[1].title ).toEqual( "test2" );
            expect( todoList.items[2].title ).toEqual( "test3" );
            
            
            todoList.removeById( items[1].id );
            expect( todoList.items.length ).toEqual( 2 );
            expect( todoList.items[0].title ).toEqual( "test1" );
            expect( todoList.items[1].title ).toEqual( "test3" );
            
            
            todoList.removeById( items[2].id );
            expect( todoList.items.length ).toEqual( 1 );
            expect( todoList.items[0].title ).toEqual( "test1" );
            
            todoList.removeById( items[0].id );
            expect( todoList.items.length ).toEqual( 0 );
        });
        
        it( "does nothing when specifies unknown id.", () => {
            todoList.removeById( 9999 );
            expect( todoList.items.length ).toEqual( 3 );
            expect( todoList.items[0].title ).toEqual( "test1" );
            expect( todoList.items[1].title ).toEqual( "test2" );
            expect( todoList.items[2].title ).toEqual( "test3" );
        });
    });
    
    describe('removeCompleted', () => {
    
        let items = [];
        
        beforeEach( () => {
            items.push(todoList.add("test1"));
            items.push(todoList.add("test2"));
            items.push(todoList.add("test3"));
        });
    
        it( "removes completed todos.", () => {
            expect( todoList.items.length ).toEqual( 3 );
            expect( todoList.items[0].title ).toEqual( "test1" );
            expect( todoList.items[1].title ).toEqual( "test2" );
            expect( todoList.items[2].title ).toEqual( "test3" );
            
            todoList.removeCompleted( );
            
            items[1].complete();
            items[2].complete();
            
            todoList.removeCompleted( );
            expect( todoList.items.length ).toEqual( 1 );
            expect( todoList.items[0].title ).toEqual( "test1" );
        });
    });
    
});