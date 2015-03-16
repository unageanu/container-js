define(function( ) {
    
    return Object.freeze({
        forFix : function( deferred, f ) {
            deferred.then( function(){} );
            
            var timeout = function() {
                if ( deferred.fixed() ) {
                    f();
                } else {
                    setTimeout(function() {
                        timeout()
                    }, 200);
                }
            };
            timeout();
        }
    });
});
