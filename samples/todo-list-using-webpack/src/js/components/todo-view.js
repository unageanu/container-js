import React from 'react';

export default React.createClass({
    
    propTypes: {
        todo:   React.PropTypes.object.isRequired,
        actions: React.PropTypes.object.isRequired
    },
    
    render() {
        const todo = this.props.todo;
        const icon = todo.completed
            ? <img src="../images/normal.png" alt="" />
            : <img src="../images/check.png" alt="checked" />;
        const command = todo.completed
            ? <a href="javascript:void(0)" onClick={this.activate}>
                activate
              </a>
            : <a href="javascript:void(0)" onClick={this.complete}>
                complete
              </a>;
              
        return (
          <div className="todo">
            {icon}
            <span className="title">{todo.title}</span>
            <span className="last-modified">{this.formatDate(todo.lastModified)}</span>
            <span className="commands">
              {command}
              <a href="javascript:void(0)" onClick={this.remove}>remove</a>
            </span>
          </div>
        );
    },
  
    complete() { this.props.actions.complete(this.props.todo.id) },
    activate() { this.props.actions.activate(this.props.todo.id) },
    remove()   { this.props.actions.remove(this.props.todo.id) }, 
  
    formatDate(d) {
        if (!d) return "";
        return d.getFullYear() 
                + "-" + (d.getMonth() + 1) 
                + "-" + d.getDate()
                + " " + d.getHours()
                + ":" + d.getMinutes()
                + ":" + d.getSeconds();
    }
});