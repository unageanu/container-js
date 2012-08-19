define( ["container"], function(ContainerJS){
    return function( args ){
        this["test.modules.B"] = ContainerJS.Inject;
        this.injectedPoperty = ContainerJS.Inject("test.modules.B");
        
        this["test.modules.C"] = ContainerJS.Inject.lazily;
        this.lazyInjectedProperty = ContainerJS.Inject.lazily("test.modules.C");
        
        this["CollectionX"] = ContainerJS.Inject.all;
        this.injectedCollectionProperty = ContainerJS.Inject.all("CollectionX");
        
        this["CollectionY"] = ContainerJS.Inject.all.lazily;
        this.lazyInjectedCollectionProperty = ContainerJS.Inject.all.lazily("CollectionY");
    };
});