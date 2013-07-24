({
    appDir: "../",
    baseUrl: "js",
    dir: "../build",
    shim: {
      "backbone": {
        deps: ["lodash", "jquery"],
        exports: "Backbone"
      }
    },
    paths: {
      backbone: "vendor/backbone-1.0.0.min",
      jquery: "vendor/jquery-2.0.3.min",
      lodash: "vendor/lodash-1.3.1.min",
      text: "vendor/text-2.0.7"
    },
    modules: [
      {
        name: "ma_app"
      }
    ]
})
