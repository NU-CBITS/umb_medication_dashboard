define([
  "backbone",
  "lib/django_model_parser"
], function(Backbone, parser) {
  var CompletedMedPrompt = Backbone.Model.extend({
    parse: parser,

    toJSON: function(options) {
      var fields = _.clone(this.attributes);
      delete fields.id;
      fields.updated_at = (new Date()).toISOString();
      var model = fields.model;
      delete fields.model;

      return [{
        pk: this.id,
        model: model,
        fields: fields
      }];
    },

    createdAt: function() {
      return this.get("event_date_time");
    },

    contactedPatient: function() {
      return this.get("contacted_patient");
    },

    awareOfIssue: function() {
      return this.get("aware_of_issue");
    },

    willDiscuss: function() {
      return this.get("will_discuss");
    },

    problemDetails: function() {
      return JSON.parse(this.get("problem_details").replace(/'/g, "\""));
    },

    participantRequestsContact: function() {
      return this.get("participant_requests_contact");
    }
  });

  return CompletedMedPrompt;
});
