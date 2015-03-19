"use strict";

const stores = ( binder ) => {
    binder.bind("todoList").to("stores.TodoList");
};
const actions = ( binder ) => {
    binder.bind("actions").to("actions.TodoListActions");
};
const dispatchers = ( binder ) => {
    binder.bind("dispatcher")
        .to("dispatchers.TodoListDispatcher")
        .onInitialize("initialize");
};

export default ( binder ) => {
    stores(binder);
    actions(binder);
    dispatchers(binder);
};