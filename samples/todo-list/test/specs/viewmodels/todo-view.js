define([
    "models/todo",
    "models/events",
    "viewmodels/todo-view",
    "test/mock/models/time-source"
], function( Todo, Events, TodoView, TimeSource ) {
    
    describe('TodoView', function() {
        
        var timeSource = new TimeSource();
        
        beforeEach(function() {
            timeSource.set(2013, 1, 1);
        });
        
        it( "reflects a model's value.", function() {
            
            var todo = new Todo(timeSource);
            todo.setTitle("test.");
            
            var view = new TodoView(todo);
            {
                expect( view.title() ).toBe( "test." ); 
                expect( view.completed() ).toBe( false );
                expect( view.createdAt() ).toEqual( new Date( 2013, 0, 1 ) );
                expect( view.lastModified() ).toEqual( new Date( 2013, 0, 1 ));
                expect( view.createdAtForDisplay() ).toEqual( "2013-1-1 0:0:0" );
                expect( view.lastModifiedForDisplay() ).toEqual( "2013-1-1 0:0:0" ); 
            }
            
            timeSource.set(2013, 2, 10);
            todo.setTitle("test2.");
            {
                expect( view.title() ).toBe( "test2." ); 
                expect( view.completed() ).toBe( false );
                expect( view.createdAt() ).toEqual( new Date( 2013, 0, 1 ) );
                expect( view.lastModified() ).toEqual( new Date( 2013, 1, 10 ));
                expect( view.createdAtForDisplay() ).toEqual( "2013-1-1 0:0:0" );
                expect( view.lastModifiedForDisplay() ).toEqual( "2013-2-10 0:0:0" ); 
            }
            
            timeSource.set(2013, 2, 12);
            todo.complete();
            {
                expect( view.title() ).toBe( "test2." ); 
                expect( view.completed() ).toBe( true );
                expect( view.createdAt() ).toEqual( new Date( 2013, 0, 1 ) );
                expect( view.lastModified() ).toEqual( new Date( 2013, 1, 12 ));
                expect( view.createdAtForDisplay() ).toEqual( "2013-1-1 0:0:0" );
                expect( view.lastModifiedForDisplay() ).toEqual( "2013-2-12 0:0:0" ); 
            }
            
            timeSource.set(2013, 3, 7);
            todo.activate();
            {
                expect( view.title() ).toBe( "test2." ); 
                expect( view.completed() ).toBe( false );
                expect( view.createdAt() ).toEqual( new Date( 2013, 0, 1 ) );
                expect( view.lastModified() ).toEqual( new Date( 2013, 2, 7 ));
                expect( view.createdAtForDisplay() ).toEqual( "2013-1-1 0:0:0" );
                expect( view.lastModifiedForDisplay() ).toEqual( "2013-3-7 0:0:0" ); 
            }
        });
    });
    
});