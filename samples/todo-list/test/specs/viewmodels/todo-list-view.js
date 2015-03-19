define([
    "container",
    "models/events",
    "test/mock/modules",
    "test/utils/wait"
], function( ContainerJS, Events, modules, Wait ) {
    
    describe('TodoListView', function() {
        
        var container;
        var deferred;
        beforeEach(function() {
            container = new ContainerJS.Container( modules );
            deferred = container.get( "todoListView" );
        });
        
        it( "first, items is empty .", function(done) {
            
            Wait.forFix(deferred, function(){
                var view = ContainerJS.utils.Deferred.unpack( deferred );
                view.todoList.load();
                
                expect( view.items().length ).toBe( 0 );
                
                done();
            });
        });
            
        it( "can adds a new todo.", function(done) {
            
            Wait.forFix(deferred, function(){
                var view = ContainerJS.utils.Deferred.unpack( deferred );
                view.todoList.load();
                
                view.todoInputForm.title("test");
                view.newTodo();
                view.todoInputForm.title("test2");
                view.newTodo();
                view.todoInputForm.title("test3");
                view.newTodo();
                
                expect( view.items().length ).toBe( 3 );
                expect( view.items()[0].title() ).toBe( "test" );
                expect( view.items()[1].title() ).toBe( "test2" );
                expect( view.items()[2].title() ).toBe( "test3" );
                
                done();
            });
        });
        
        it( "can removes a todo.", function(done) {
            
            Wait.forFix(deferred, function(){
                var view = ContainerJS.utils.Deferred.unpack( deferred );
                view.todoList.load();
                
                view.todoInputForm.title("test");
                view.newTodo();
                view.todoInputForm.title("test2");
                view.newTodo();
                view.todoInputForm.title("test3");
                view.newTodo();
                
                expect( view.items().length ).toBe( 3 );
                expect( view.items()[0].title() ).toBe( "test" );
                expect( view.items()[1].title() ).toBe( "test2" );
                expect( view.items()[2].title() ).toBe( "test3" );
                
                view.items()[1].remove();
                
                expect( view.items().length ).toBe( 2 );
                expect( view.items()[0].title() ).toBe( "test" );
                expect( view.items()[1].title() ).toBe( "test3" );
                
                done();
            });
        });

        
        it( "can removes completed todos.", function(done) {
            
            Wait.forFix(deferred, function(){
                var view = ContainerJS.utils.Deferred.unpack( deferred );
                view.todoList.load();
                
                expect( view.enableToRemoveCompleted() ).toBe( false );
                
                view.todoInputForm.title("test");
                view.newTodo();
                view.todoInputForm.title("test2");
                view.newTodo();
                view.todoInputForm.title("test3");
                view.newTodo();
                
                expect( view.items().length ).toBe( 3 );
                expect( view.items()[0].title() ).toBe( "test" );
                expect( view.items()[1].title() ).toBe( "test2" );
                expect( view.items()[2].title() ).toBe( "test3" );
                
                expect( view.enableToRemoveCompleted() ).toBe( false );
                
                view.items()[0].complete();
                expect( view.enableToRemoveCompleted() ).toBe( true );
                view.items()[2].complete();
                expect( view.enableToRemoveCompleted() ).toBe( true );
                view.removeCompleted();
                
                expect( view.items().length ).toBe( 1 );
                expect( view.items()[0].title() ).toBe( "test2" );
                
                expect( view.enableToRemoveCompleted() ).toBe( false );
                
                view.items()[0].complete();
                expect( view.enableToRemoveCompleted() ).toBe( true );
                view.items()[0].activate();
                expect( view.enableToRemoveCompleted() ).toBe( false );
                
                done();
            });
        });
        
    });
    
});