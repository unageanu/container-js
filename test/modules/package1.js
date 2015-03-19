define( ["container"], function(ContainerJs){
    
    var A = function( args ){
        this.args = args;
        this.type = "test.modules.package1.A";
    }; 
    
    var B = {
        type : "test.modules.package1.B"
    };
    var C = {
        type : "test.modules.package1.C"
    };
    return {
        A : A,
        B : B,
        C : C
    }
});