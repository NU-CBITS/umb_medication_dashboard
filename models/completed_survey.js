define(["backbone"], function(Backbone) {
  var CompletedSurvey = Backbone.Model.extend({
    parse: function(data, options) {
      var parsed = {};

      _.each(data, function(v, k) {
        var attr = k.substr("feature_value_dt_".length);
        parsed[attr] = typeof v === "string" && attr === "timestarted" ? v.substr(0, 10) : v;
      });

      return parsed;
    }
  });

  return CompletedSurvey;
});