define([
  "backbone",
  "models/calendar"
], function(Backbone, Calendar) {
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
    },

    previousSpanAdherencePct: function(days) {
      var self = this,
          dates = (new Calendar()).dates("iso8601", { days: days });

      var adherentDates = _.filter(dates, function(date) {
        return allDosesTaken(date);
      });

      function allDosesTaken(date) {
        var dosesOnDate = self.getAssignedDoses().getValuesOnDate(date).doses;

        return _.all(dosesOnDate, function(dose) {
          return self.medPromptSurveys.responseStatus(dose, date) === "positive";
        });
      }

      return Math.round(100 * adherentDates.length / dates.length);
    }
  });

  return Participant;
});
