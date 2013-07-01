define([
  "backbone",
  "models/completed_survey"
], function(Backbone, CompletedSurvey) {
  var CompletedSurveys = Backbone.Collection.extend({
    model: CompletedSurvey,

    initialize: function(options) {
      this.url = options.url;
    }
  });

  return CompletedSurveys;
});