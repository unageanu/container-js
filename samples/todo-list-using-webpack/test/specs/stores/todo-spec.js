import Todo    from '../../../src/js/stores/todo';

describe('Todo', () => {
    
    describe('new', () => {
        it( "can creates a new instance.", () => {
            
            jasmine.clock().mockDate(new Date(2013,0,1));
            
            let todo = new Todo("test");
            
            expect( todo.title ).toEqual( "test" );
            expect( todo.completed ).toEqual( false );
            expect( todo.createdAt ).toEqual( new Date(2013,0,1) );
            expect( todo.lastModified ).toEqual( new Date(2013,0,1) );
        });
        
        it( "can creates a new instance from arguments.", () => {
            
            jasmine.clock().mockDate(new Date(2013,0,1));
            
            let todo = new Todo("test", true, new Date(2014, 1, 1));
            
            expect( todo.title ).toEqual( "test" );
            expect( todo.completed ).toEqual( true );
            expect( todo.createdAt ).toEqual( new Date(2014, 1, 1) );
            expect( todo.lastModified ).toEqual( new Date(2014, 1, 1) );
        });

        it( "generate a new id.", () => {
            
            let todo1 = new Todo("test");
            let todo2 = new Todo("test");
            
            expect( todo1.id ).not.toEqual( todo2.id );
        });
    });
    
    describe('setTitle', () => {
        it( "can updates a title and lastModified.", () => {
            
            jasmine.clock().mockDate(new Date(2013,0,1));
            let todo = new Todo("title" );
            
            jasmine.clock().mockDate(new Date(2013,0,2));
            todo.setTitle("title2");
            
            expect( todo.title ).toEqual( "title2" );
            expect( todo.completed ).toEqual( false );
            expect( todo.createdAt ).toEqual( new Date(2013,0,1) );
            expect( todo.lastModified ).toEqual( new Date(2013,0,2) );
        });
    });
    
    describe('complete', () => {
        it( "'complete' can updates a completed state and lastModified.", () => {
            
            jasmine.clock().mockDate(new Date(2013,0,1));
            let todo = new Todo("title");
            
            jasmine.clock().mockDate(new Date(2013,0,2));
            todo.complete();
            
            expect( todo.title ).toEqual( "title" );
            expect( todo.completed ).toEqual( true );
            expect( todo.createdAt ).toEqual( new Date(2013,0,1) );
            expect( todo.lastModified ).toEqual( new Date(2013,0,2) );
        });
    });
    
    describe('activate', () => {
        it( "'activate' can updates a completed state and lastModified.", () => {
            
            jasmine.clock().mockDate(new Date(2013,0,1));
            let todo = new Todo("title");
            
            jasmine.clock().mockDate(new Date(2013,0,2));
            todo.complete();
            
            jasmine.clock().mockDate(new Date(2013,0,3));
            todo.activate();
            
            expect( todo.title ).toEqual( "title" );
            expect( todo.completed ).toEqual( false );
            expect( todo.createdAt ).toEqual( new Date(2013,0,1) );
            expect( todo.lastModified ).toEqual( new Date(2013,0,3) );
        });
    });
    
});