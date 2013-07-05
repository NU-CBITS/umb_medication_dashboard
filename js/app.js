requirejs.config({
  baseUrl: "js",
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
  }
});

define([
  "views/app_view",
  "router",
  "backbone"
], function(AppView, router, Backbone) {
  new AppView({ router: router });
  Backbone.history.start({
    root: window.location.pathname,
    pushState: true
  });
});