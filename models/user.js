define(["backbone"], function(Backbone) {
  var User = Backbone.Model.extend({
    initialize: function(options) {
      this.url = options.url;
    },

    doses: function() {
      return this.get("doses");
    },

    patientName: function() {
      return _.find(this.get("people"), { type: "patient" }).name;
    }
  });

  return User;
});