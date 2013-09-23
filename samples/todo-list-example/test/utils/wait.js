define(function( ) {
    
    return Object.freeze({
        forFix : function( deferred ) {
            deferred.then( function(){} );
            waitsFor(function() {
                return deferred.fixed();
            }, null, 2000);
        }
    });
});
