require.config({
    baseUrl: "../dst/js",
    paths: {
        "container" : "../../../../minified/container",
        "knockout"  : "./knockout-2.3.0",
        "test"      : "../../test",
        "jasmine"   : "../../node_modules/jasmine-core/lib/jasmine-core"
    },
    waitSeconds: 1
});