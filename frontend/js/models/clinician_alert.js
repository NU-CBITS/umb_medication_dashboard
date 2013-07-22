define([
  "backbone",
  "lib/django_model_parser"
], function(Backbone, parser) {
  var CompletedMedPrompt = Backbone.Model.extend({
    parse: parser,

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
