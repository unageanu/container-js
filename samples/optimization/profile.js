{
    appDir: 'web',
    baseUrl: 'scripts',
    dir: './dst',
    paths: {
        "container": "../../../../minified/container"
    },
    modules: [
        {
            name: 'app/common',
            exclude: ['container']
        },{
            name: 'app/a',
            exclude: ['container','app/common'],
            include: [
              "app/model/amodel",
              "app/view/aview"
            ]
        },{
            name: 'app/b',
            exclude: ['container','app/common'],
            include: [
              "app/model/bmodel",
              "app/view/bview"
            ]
        }
    ]
}