
load(environment["envjs.home"]+"/dist/env.rhino.js");
load("../tools/r.js");
load("../lib/require.js");
load(environment["config"] || "config.js");

var consoleReporter = null;
require(["jasmine/jasmine"], function() {
    require(["jasmine/jasmine-html","larrymyers-jasmine-reporters/jasmine.console_reporter"], function() {
        require(["test/all-specs"], function() {
            consoleReporter = new jasmine.ConsoleReporter();
            jasmine.getEnv().addReporter( consoleReporter );
            jasmine.getEnv().execute();
        });
    });
});

Envjs.wait();

var filedCount = consoleReporter.executed_specs - consoleReporter.passed_specs;
quit(filedCount <= 0 ? 0 : 1);