define(["backbone"], function(Backbone) {
  var User = Backbone.Model.extend({
    initialize: function(options) {
      this.url = options.url;
    }
  });

  return User;
});