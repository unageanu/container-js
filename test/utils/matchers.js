define( [
    "containerjs/utils/deferred"
], function( Deferred ) {
    
    return Object.freeze({
        
        toResolveWith: function(util) {
            return {
                compare: function(actual, expected) {
                    var result = util.equals( 
                        Deferred.unpack(actual), expected );
                    return {pass:result};
                }
            };
        },
        
        toRejectWith: function(util) {
            return {
                compare: function(actual, expected) {
                    try {
                        var result = Deferred.unpack(actual);
                        throw new Error('the posmise resolved with ' + String(result));
                    } catch ( error ) {
                        var result = util.equals(error.message || error, expected.message || expected);
                        return {pass:result};
                    }
                }
            };
        }
    });
});

