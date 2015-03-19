require.config({
    baseUrl: "../minified",
    deps : [
        "../minified/container.js"
    ],
    paths: {
        "test" : "../test",
        "jasmine" : "../node_modules/jasmine-core/lib/jasmine-core"
    },
    waitSeconds: 1
});