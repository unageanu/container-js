require.config({
    baseUrl: "../minified",
    deps : [
        "../minified/container.js"
    ],
    paths: {
        "test" : "../test",
        "jasmine" : "../lib-test/jasmine-1.0.2/",
        "larrymyers-jasmine-reporters" : "../lib-test/larrymyers-jasmine-reporters-adf6227/src"
    },
});