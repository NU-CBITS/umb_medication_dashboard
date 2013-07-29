define(["backbone"], function(Backbone) {
  var CompletedMedPrompt = Backbone.Model.extend({
    parse: function(data, options) {
      var parsed = {};

      _.each(data.fields, function(v, k) {
        parsed[k] = v;
      });

      return parsed;
    },

    doseTime: function() {
      return this.get("doseTime");
    },

    date: function() {
      return this.get("date");
    },

    timestamp: function() {
      return this.get("timestamp");
    },

    nonadherenceDueToSideEffects: function() {
      return (this.get("reason_for_missing") === "The side effects make me feel bad.") ? this.get("date") : false;
    }
  });

  return CompletedMedPrompt;
});
