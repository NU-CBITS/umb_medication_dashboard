define([
  "backbone"
], function(Backbone) {
  var Participant = Backbone.Model.extend({
    initialize: function(attributes, options) {
      this.latestAction = null;
      this.assignedDoses = [];
    },

    patientId: function() {
      return this.id;
    },

    patientName: function() {
      return this.id;
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
    }
  });

  return Participant;
});
