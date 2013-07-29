define(["backbone"], function(Backbone) {
  var SentMessage = Backbone.Model.extend({
    parse: function(data, options) {
      var parsed = {};

      _.each(data.fields, function(v, k) {
        parsed[k] = v;
      });

      return parsed;
    },

    timestamp: function() {
      return this.get("timestamp");
    }
  });

  return SentMessage;
});
