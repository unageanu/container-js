define([
    "container",
    "models/events",
    "test/mock/modules",
    "test/utils/wait"
], function( ContainerJS, Events, modules, Wait ) {
    
    describe('TodoInputForm', function() {
        
        var container;
        beforeEach(function() {
            container = new ContainerJS.Container( modules );
        });
        
        it( "'newTodo' can create a new Todo.", function() {
            
            var deferred = container.get( "todoInputForm" );
            Wait.forFix(deferred);
            
            runs( function(){
                var form = ContainerJS.utils.Deferred.unpack( deferred );
                {
                    expect( form.title() ).toBe( "" ); 
                    expect( form.titleLength() ).toBe( 0 );
                    expect( form.error() ).toBe( "" ); 
                    
                    expect( form.todoList.items.length ).toBe( 0 ); 
                }
                
                form.title("test.");
                {
                    expect( form.title() ).toBe( "test." ); 
                    expect( form.titleLength() ).toBe( 5 ); 
                    expect( form.error() ).toBe( "" ); 
                }
                
                form.newTodo();
                {
                    expect( form.title() ).toBe( "" ); 
                    expect( form.titleLength() ).toBe( 0 );
                    expect( form.error() ).toBe( "" ); 
                    
                    expect( form.todoList.items.length ).toBe( 1 ); 
                    expect( form.todoList.items[0].title ).toBe( "test." ); 
                }
            }); 
        });
        
        it( "'newTodo' fails when the title is invalid.", function() {
            
            var deferred = container.get( "todoInputForm" );
            Wait.forFix(deferred);
            
            runs( function(){
                var form = ContainerJS.utils.Deferred.unpack( deferred );

                form.newTodo();
                {
                    expect( form.title() ).toBe( "" ); 
                    expect( form.titleLength() ).toBe( 0 );
                    expect( form.error() ).toBe( "title is not set." ); 
                    
                    expect( form.todoList.items.length ).toBe( 0 ); 
                }
                
                form.title( createStringOfLength(101) );
                form.newTodo();
                {
                    expect( form.title() ).toBe( createStringOfLength(101) ); 
                    expect( form.titleLength() ).toBe( 101 );
                    expect( form.error() ).toBe( "title is too long." ); 
                    
                    expect( form.todoList.items.length ).toBe( 0 ); 
                }
                
                form.title( createStringOfLength(100) );
                form.newTodo();
                {
                    expect( form.title() ).toBe( "" ); 
                    expect( form.titleLength() ).toBe( 0 );
                    expect( form.error() ).toBe( "" ); 
                    
                    expect( form.todoList.items.length ).toBe( 1 ); 
                    expect( form.todoList.items[0].title ).toBe( createStringOfLength(100) ); 
                }
            }); 
        });
        
        var createStringOfLength = function(length) {
            var str = "";
            for ( var i=length;i>0;i-- ) str += "a";
            return str;
        };
    });
    
});