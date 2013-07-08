define(["backbone", "models/user"], function(Backbone, User) {
  var Participants = Backbone.Collection.extend({
    initialize: function(options) {
      this.url = options.url;
    },

    model: User
  });

  return Participants;
});