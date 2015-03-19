define( ["container"], function(ContainerJs){
    
    var A = function( args ){
        this.args = args;
        this.type = "test.modules.package2.A";
    }; 
    
    var B = {
        type : "test.modules.package2.B"
    };
    var C = {
        type : "test.modules.package2.C"
    };
    return {
        modules : {
            package2 : {
                A : A,
                B : B,
                C : C
            }
        }
    };
});