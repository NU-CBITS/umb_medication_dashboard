define(["backbone"], function(Backbone) {
  var SentMessage = Backbone.Model.extend({
    parse: function(data, options) {
      var parsed = {};

      _.each(data, function(v, k) {
        var attr = k.substr("feature_value_dt_".length);

        parsed[attr] = v;
      });

      return parsed;
    }
  });

  return SentMessage;
});