'use strict';

var Jasmine   = require('jasmine');

module.exports = function(done) {
    var jasmine = new Jasmine();
    jasmine.configureDefaultReporter({
        onComplete: function(pass){  
            done(pass ? null : new Error("test failed.")); 
        }
    });
    return jasmine;
};