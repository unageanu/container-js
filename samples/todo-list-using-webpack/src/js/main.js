import "babel-core/polyfill";

import React        from 'react';
import ContainerJS  from 'container-js';
import modules      from './composing/modules';
import TodoListView from './components/todo-list-view';

document.addEventListener( "DOMContentLoaded", ()=> {
    const container = new ContainerJS.Container( 
        modules, 
        ContainerJS.PackagingPolicy.COMMON_JS_MODULE_PER_CLASS,
        ContainerJS.Loaders.COMMON_JS
    );
    
    ContainerJS.utils.Deferred.when([
        container.get("todoList"),
        container.get("actions")
    ]).then(
        (components) => {
            try { 
                React.render( <TodoListView todoList={components[0]} actions={components[1]} />, document.body );
            } catch (e) { 
                console.log(e);
            }
        },
        (error) => console.log(error)
    );
}); 