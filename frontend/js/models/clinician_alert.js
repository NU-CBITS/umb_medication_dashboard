define(["backbone"], function(Backbone) {
  var CompletedMedPrompt = Backbone.Model.extend({
    parse: function(data, options) {
      var parsed = {};

      _.each(data.fields, function(v, k) {
        parsed[k] = v;
      });

      return parsed;
    },

    createdAt: function() {
      return this.get("created_at");
    },

    contactedPatient: function() {
      return this.get("contacted_patient");
    },

    awareOfIssue: function() {
      return this.get("aware_of_issue");
    },

    willDiscuss: function() {
      return this.get("will_discuss");
    }
  });

  return CompletedMedPrompt;
});
