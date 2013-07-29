define([
  "backbone",
  "../../config/resource_locations",
  "lib/django_model_parser",
  "models/dose"
], function(Backbone, Resources, parser, Dose) {
  var Participant = Backbone.Model.extend({
    initialize: function(attributes, options) {
      this.environment = options.environment;
      this.appCode = options.appCode;
      this.latestAction = null;
      this.assignedDoses = [];
    },

    parse: parser,

    url: function() {
      return Resources[this.environment].urlRoot + this.appCode + "/participants/" + this.id + "/user_config";
    },

    patientId: function() {
      return this._patient().id;
    },

    patientName: function() {
      return this._patient().name;
    },

    lastMissedDoseDueToSideEffects: function() {
      var survey = _.last(this.medPromptSurveys.filter(function(survey) {
        return survey.nonadherenceDueToSideEffects();
      }))

      return survey ? survey.doseTime() : null;
    },

    getLatestAction: function() {
      return this.latestAction;
    },

    setLatestAction: function(action) {
      this.latestAction = action;
    },

    getAssignedDoses: function() {
      return this.assignedDoses;
    },

    getCurrentDoses: function() {
      return (_.last(this.getAssignedDoses().getValues()) || {}).doses;
    },

    setAssignedDoses: function(dosesByStartDate) {
      this.assignedDoses = dosesByStartDate;
    },

    _patient: function() {
      return _.find(this.get("people"), { type: "patient" });
    }
  });

  return Participant;
});
