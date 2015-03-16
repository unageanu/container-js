define([
    "models/todo",
    "models/events",
    "test/mock/models/time-source"
], function( Todo, Events, TimeSource ) {
    
    describe('Todo', function() {
        
        var timeSource = new TimeSource();
        timeSource.set(2013, 1, 1);
        
        it( "'new' creates a new instance.", function() {
            
            var todo = new Todo(timeSource);
            
            expect( todo.title ).toEqual( "" );
            expect( todo.completed ).toEqual( false );
            expect( todo.createdAt ).toEqual( new Date(2013,0,1) );
            expect( todo.lastModified ).toEqual( new Date(2013,0,1) );
        });
        
        it( "'Todo.create' can creates a new instance with specified properties.", function() {
            
            var todo = Todo.create(timeSource, "title", 
                    true, new Date(1000), new Date(2000) );
            
            expect( todo.title ).toEqual( "title" );
            expect( todo.completed ).toEqual( true );
            expect( todo.createdAt ).toEqual( new Date(1000) );
            expect( todo.lastModified ).toEqual( new Date(2000) );
            
            todo = Todo.create(timeSource, "title2", 
                    false, new Date(2000), new Date(3000) );
            
            expect( todo.title ).toEqual( "title2" );
            expect( todo.completed ).toEqual( false );
            expect( todo.createdAt ).toEqual( new Date(2000) );
            expect( todo.lastModified ).toEqual( new Date(3000) );
        });
        
        it( "'setTitle' can updates a title and fire updated events.", function() {
            
            var todo = Todo.create(timeSource, "title", 
                    false, new Date(1000), new Date(2000) );
            
            var events = [];
            todo.addObserver( Events.UPDATED, function(ev) {
                events.push( ev );
            });
            
            todo.setTitle("title2");
            
            expect( todo.title ).toEqual( "title2" );
            expect( todo.completed ).toEqual( false );
            expect( todo.createdAt ).toEqual( new Date(1000) );
            expect( todo.lastModified ).not.toEqual( new Date(2000) );
            
            
            expect( events.length ).toEqual( 2 );
            
            expect( events[0].eventId ).toEqual( Events.UPDATED );
            expect( events[0].propertyName ).toEqual( "title" );
            expect( events[0].newValue ).toEqual( "title2" );
            expect( events[0].oldValue ).toEqual( "title" );
            
            expect( events[1].eventId ).toEqual( Events.UPDATED );
            expect( events[1].propertyName ).toEqual( "lastModified" );
            expect( events[1].newValue ).toEqual( todo.lastModified );
            expect( events[1].oldValue ).toEqual( new Date(2000) );
        });
        
        it( "'complete' can updates a completed state and fire updated events.", function() {
            
            var todo = Todo.create(timeSource, "title", 
                    false, new Date(1000), new Date(2000) );
            
            var events = [];
            todo.addObserver( Events.UPDATED, function(ev) {
                events.push( ev );
            });
            
            todo.complete();
            
            expect( todo.title ).toEqual( "title" );
            expect( todo.completed ).toEqual( true );
            expect( todo.createdAt ).toEqual( new Date(1000) );
            expect( todo.lastModified ).not.toEqual( new Date(2000) );
            
            
            expect( events.length ).toEqual( 2 );
            
            expect( events[0].eventId ).toEqual( Events.UPDATED );
            expect( events[0].propertyName ).toEqual( "completed" );
            expect( events[0].newValue ).toEqual( true );
            expect( events[0].oldValue ).toEqual( false );
            
            expect( events[1].eventId ).toEqual( Events.UPDATED );
            expect( events[1].propertyName ).toEqual( "lastModified" );
            expect( events[1].newValue ).toEqual( todo.lastModified );
            expect( events[1].oldValue ).toEqual( new Date(2000) );
        });
        
        it( "'activate' can updates a completed state and fire updated events.", function() {
            
            var todo = Todo.create(timeSource, "title", 
                    true, new Date(1000), new Date(2000) );
            
            var events = [];
            todo.addObserver( Events.UPDATED, function(ev) {
                events.push( ev );
            });
            
            todo.activate();
            
            expect( todo.title ).toEqual( "title" );
            expect( todo.completed ).toEqual( false );
            expect( todo.createdAt ).toEqual( new Date(1000) );
            expect( todo.lastModified ).not.toEqual( new Date(2000) );
            
            
            expect( events.length ).toEqual( 2 );
            
            expect( events[0].eventId ).toEqual( Events.UPDATED );
            expect( events[0].propertyName ).toEqual( "completed" );
            expect( events[0].newValue ).toEqual( false );
            expect( events[0].oldValue ).toEqual( true );
            
            expect( events[1].eventId ).toEqual( Events.UPDATED );
            expect( events[1].propertyName ).toEqual( "lastModified" );
            expect( events[1].newValue ).toEqual( todo.lastModified );
            expect( events[1].oldValue ).toEqual( new Date(2000) );
        });
    });
    
});