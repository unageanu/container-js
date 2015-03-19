define( ["container"], function(ContainerJs){
    var f = function( args ){
        this.args = args;
        this.type = "test.modules.A";
    };
    f.prototype.methodA = function(arg) {
        return "a_" + arg;
    };
    f.prototype.methodB = function(arg) {
        return "b_" + arg;
    };
    return f;
});