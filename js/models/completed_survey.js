define(["backbone"], function(Backbone) {
  var CompletedSurvey = Backbone.Model.extend({
    COLUMN_PREFIX_LENGTH: "feature_value_dt_".length,

    parse: function(data, options) {
      var self = this,
          parsed = {};

      _.each(data.fields, function(v, k) {
        var attr = k.substr(self.COLUMN_PREFIX_LENGTH);

        parsed[attr] = v;
      });

      return parsed;
    },

    doseTime: function() {
      return this.get("doseTime");
    }
  });

  return CompletedSurvey;
});