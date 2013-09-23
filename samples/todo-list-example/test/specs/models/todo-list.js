define([
    "models/todo-list",
    "models/events",
    "test/mock/models/time-source"
], function( TodoList, Events, TimeSource ) {
    
    describe('TodoList', function() {
        
        var todoList;
        var events = [];
        beforeEach(function() {
            todoList = new TodoList();
            todoList.timeSource = new TimeSource();
            [Events.LOADED,Events.ADDED,Events.REMOVED].forEach(function(i) {
                todoList.addObserver( i, function(ev) {
                    events.push( ev );
                });
            });
        });
        afterEach(function() {
            events = [];
        });
        
        it( "'add' creates and add a new todo.", function() {
            
            todoList.add("test1");
            
            expect( events.length ).toEqual( 1 );
            
            expect( events[0].eventId ).toEqual( Events.ADDED );
            expect( events[0].added.length ).toEqual( 1 );
            expect( events[0].added[0].title ).toEqual( "test1" );
            expect( events[0].items.length ).toEqual( 1 );
            expect( events[0].items[0].title ).toEqual( "test1" );
            
            
            todoList.add("test2");
            
            expect( events.length ).toEqual( 2 );
            
            expect( events[1].eventId ).toEqual( Events.ADDED );
            expect( events[1].added.length ).toEqual( 1 );
            expect( events[1].added[0].title ).toEqual( "test2" );
            expect( events[1].items.length ).toEqual( 2 );
            expect( events[1].items[0].title ).toEqual( "test1" );
            expect( events[1].items[1].title ).toEqual( "test2" );
        });
        
        it( "'removeById' removes todos by id.", function() {
            
            var items = [];
            items.push(todoList.add("test1"));
            items.push(todoList.add("test2"));
            items.push(todoList.add("test3"));
            
            expect( todoList.items.length ).toEqual( 3 );
            events = [];
            
            todoList.removeById( items[1].id );
            {
                expect( todoList.items.length ).toEqual( 2 );
                
                expect( events.length ).toEqual( 1 );
                expect( events[0].eventId ).toEqual( Events.REMOVED );
                expect( events[0].removed.length ).toEqual( 1 );
                expect( events[0].removed[0].title ).toEqual( "test2" );
                expect( events[0].items.length ).toEqual( 2 );
                expect( events[0].items[0].title ).toEqual( "test1" );
                expect( events[0].items[1].title ).toEqual( "test3" );
            }
            
            todoList.removeById( items[2].id );
            {
                expect( todoList.items.length ).toEqual( 1 );
                
                expect( events.length ).toEqual( 2 );
                expect( events[1].eventId ).toEqual( Events.REMOVED );
                expect( events[1].removed.length ).toEqual( 1 );
                expect( events[1].removed[0].title ).toEqual( "test3" );
                expect( events[1].items.length ).toEqual( 1 );
                expect( events[1].items[0].title ).toEqual( "test1" );
            }
            
            todoList.removeById( 9999 );
            {
                expect( todoList.items.length ).toEqual( 1 );
                expect( events.length ).toEqual( 2 );
            }
            
            todoList.removeById( items[0].id );
            {
                expect( todoList.items.length ).toEqual( 0 );
                
                expect( events.length ).toEqual( 3 );
                expect( events[2].eventId ).toEqual( Events.REMOVED );
                expect( events[2].removed.length ).toEqual( 1 );
                expect( events[2].removed[0].title ).toEqual( "test1" );
                expect( events[2].items.length ).toEqual( 0 );
            }
        });
        
        it( "'removeCompleted' removes completed todos.", function() {
            
            var items = [];
            items.push(todoList.add("test1"));
            items.push(todoList.add("test2"));
            items.push(todoList.add("test3"));
            
            expect( todoList.items.length ).toEqual( 3 );
            events = [];
            
            todoList.removeCompleted( );
            {
                expect( todoList.items.length ).toEqual( 3 );
                expect( events.length ).toEqual( 0 );
            }
            
            
            items[1].complete();
            items[2].complete();
            
            todoList.removeCompleted( );
            {
                expect( todoList.items.length ).toEqual( 1 );
                
                expect( events.length ).toEqual( 1 );
                expect( events[0].eventId ).toEqual( Events.REMOVED );
                expect( events[0].removed.length ).toEqual( 2 );
                expect( events[0].removed[0].title ).toEqual( "test2" );
                expect( events[0].removed[1].title ).toEqual( "test3" );
                expect( events[0].items.length ).toEqual( 1 );
                expect( events[0].items[0].title ).toEqual( "test1" );
            }
            
            
            items[0].complete();
            
            todoList.removeCompleted( );
            {
                expect( todoList.items.length ).toEqual( 0 );
                
                expect( events.length ).toEqual( 2 );
                expect( events[1].eventId ).toEqual( Events.REMOVED );
                expect( events[1].removed.length ).toEqual( 1 );
                expect( events[1].removed[0].title ).toEqual( "test1" );
                expect( events[1].items.length ).toEqual( 0 );
            }
        });
    });
    
});