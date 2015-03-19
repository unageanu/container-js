import React       from 'react';
import ContainerJS from 'container-js';

export default React.createClass({
    
    propTypes: {
        actions:  React.PropTypes.object.isRequired
    },
    
    getInitialState(){
        return { error: "", title:"" };
    },
    
    render() {
        return (
            <div className="todo-input-form">
              title:
              &nbsp;
              <input 
                type="text" 
                className="title-field" 
                value={this.state.title}
                onChange={this.onChange}
              ></input>
              &nbsp;&nbsp;
              <button onClick={this.newTodo} className="add-button">
                add
              </button>
              <div className="error">{this.state.error}</div>
            </div >
        );
    },
    
    onChange(event) {
        this.setState({error:"", title: event.target.value});
    },
    
    newTodo(event) {
        try {
            this.props.actions.add( this.state.title );
            this.setState({error:"", title:""});
        } catch ( exception ) {
            this.setState({error:exception.message, title:""});
        }
    }
});