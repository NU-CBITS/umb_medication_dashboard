define([
  "backbone",
  "lib/django_model_parser"
], function(Backbone, parser) {
  var CompletedMedPrompt = Backbone.Model.extend({
    parse: parser,

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
