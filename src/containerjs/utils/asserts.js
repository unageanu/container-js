define( function(){
    
    "use strict";
    
    var Asserts = {
        
        /**
         * @param {*} value
         * @param {string} name 
         */
        assertNotNull : function( value, name ) {
            if ( value == null ) 
                throw new Error( name + " is null or undefined." );
        },
        /**
         * @param {string} value
         * @param {string} name 
         */
        assertNotEmpty : function( value, name ) {
            Asserts.assertNotNull( value, name );
            if ( value === "" ) 
                throw new Error( name + " is empty string." );
        },
        /**
         * @param {function(*):*} value
         * @param {string} name 
         */
        assertValueIsFunction : function( value, name ) {
            Asserts.assertNotNull( value, name );
            if ( typeof value !== "function" ) 
                throw new Error( name + " is not function." );
        }
        
    };
    
    
    return Object.freeze(Asserts);

});