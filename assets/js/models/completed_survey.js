define(["backbone"], function(Backbone) {
  var CompletedSurvey = Backbone.Model.extend({
    COLUMN_PREFIX_LENGTH: "FEATURE_VALUE_DT_".length,

    parse: function(data, options) {
      var self = this,
          parsed = {};

      _.each(data.fields, function(v, k) {
        var attr = k.substr(self.COLUMN_PREFIX_LENGTH);

        parsed[attr] = v;
      });

      return parsed;
    },

    date: function() {
      return this.get("date");
    },

    timestamp: function() {
      return this.get("timestamp");
    },

    alwaysBotheredBy: function(problem) {
      var filter = null;
      if (problem === "symptoms") {
        filter = function(v, k) {
          return /_frequency/.test(k) && v === "Almost all of the time";
        };
      } else {
        filter = function(v, k) {
          return /_distress/.test(k) && v === "Always";
        };
      }

      return _.any(this.attributes, filter);
    }
  });

  return CompletedSurvey;
});
