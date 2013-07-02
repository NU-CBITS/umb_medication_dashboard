define(["backbone"], function(Backbone) {
  var CompletedSurvey = Backbone.Model.extend({
    COLUMN_PREFIX_LENGTH: "feature_value_dt_".length,

    parse: function(data, options) {
      var self = this,
          parsed = {};

      _.each(data, function(v, k) {
        var attr = k.substr(self.COLUMN_PREFIX_LENGTH);

        parsed[attr] = v === true ? "Yes" : (v === false ? "No" : v);
      });

      return parsed;
    }
  });

  return CompletedSurvey;
});