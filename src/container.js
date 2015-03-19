define([
    "containerjs/container",
    "containerjs/scope",
    "containerjs/inject",
    "containerjs/packaging-policy",
    "containerjs/loaders",
    "containerjs/utils/deferred"
], function( Container, Scope, Inject, PackagingPolicy, Loaders, Deferred ){

    "use strict";

    var container = {
        VERSION:         "1.0.5",

        Container:       Container,
        Scope:           Scope,
        Inject:          Inject,
        PackagingPolicy: PackagingPolicy,
        Loaders:         Loaders,

        utils: Object.freeze({
            Deferred: Deferred
        })
    };

    Object.freeze(container);
    return container;
});
