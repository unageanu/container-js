define( [
    "containerjs/utils/deferred"
], function( Deferred ) {
    
    return Object.freeze({
        
        toResolveWith: function(expected) {
            return this.env.equals_( 
                Deferred.unpack(this.actual), expected );
        },
        
        toRejectWith: function(expected) {
            try {
                var result = Deferred.unpack(this.actual);
                throw new Error('the posmise resolved with ' + String(result));
            } catch ( error ) {
                return this.env.equals_(error.message || error, expected.message || expected);
            }
        }
        
    });
});

