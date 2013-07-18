define(["backbone"], function(Backbone) {
  var SentMessage = Backbone.Model.extend({
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

    timestamp: function() {
      return this.get("timestamp");
    }
  });

  return SentMessage;
});
