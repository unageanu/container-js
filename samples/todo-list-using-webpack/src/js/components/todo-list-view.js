import React         from 'react';
import ContainerJS   from 'container-js';
import TodoView      from './todo-view';
import TodoInputForm from './todo-input-form';

export default React.createClass({
    
    propTypes: {
        todoList: React.PropTypes.object.isRequired,
        actions:  React.PropTypes.object.isRequired
    },
    
    getInitialState(){
        return this.retrieveState();
    },
    
    componentDidMount() {
        Object.observe(this.props.todoList, this.onChange, ['update']);
        Array.observe(this.props.todoList.items, this.onChange);
    },
    componentWillUnmount() {
        Object.unobserve(this.props.todoList, this.onChange);
        Array.unobserve(this.props.todoList.items, this.onChange);
    },
    
    render() {
        let enableToRemoveCompleted = false;
        const todos = [];
        
        this.state.todos.forEach((item) => {
           if ( item.completed ) enableToRemoveCompleted = true;
           todos.push(<TodoView todo={item} actions={this.props.actions} />)
        });

        return (
            <div>
              <TodoInputForm actions={this.props.actions} />
              <div className="todo-list">
                {todos}
              </div>
              <div className="buttons">
                <button onClick={this.removeCompleted} disabled={!enableToRemoveCompleted}>
                   remove completed
                </button>
              </div>
            </div>
        );
    },
    
    onChange() {
        this.props.todoList.items.forEach((todo)=> {
            Object.unobserve(todo, this.onTodoChange);
            Object.observe(todo, this.onTodoChange, ['update']);
        });
        
        Array.unobserve(this.props.todoList.items, this.onChange);
        Array.observe(this.props.todoList.items, this.onChange);
        
        this.setState(this.retrieveState());
    },
    onTodoChange() { 
        this.setState(this.retrieveState()); 
    },
    
    removeCompleted() {
         this.props.actions.removeCompleted();
    },
    retrieveState() {
        return { todos : this.props.todoList ? this.props.todoList.items : [] };
    }
});