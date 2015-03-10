define([
    "containerjs/container",
    "containerjs/scope",
    "containerjs/inject",
    "containerjs/packaging-policy",
    "containerjs/utils/deferred"
], function( Container, Scope, Inject, PackagingPolicy, Deferred ){

    "use strict";

    var container = {
        VERSION:         "1.0.0",

        Container:       Container,
        Scope:           Scope,
        Inject:          Inject,
        PackagingPolicy: PackagingPolicy,

        utils: Object.freeze({
            Deferred: Deferred
        })
    };

    Object.freeze(container);
    return container;
});
