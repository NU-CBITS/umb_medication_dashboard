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
      return (this.get('first_name') || '').slice(0, 1) + ' ' + (this.get('last_name') || '');
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

    enrollmentDate: function() {
      return this.get('enrollment_date');
    },

    daysEnrolled: function() {
      var today = new Date();
      today.setUTCHours(12);
      today.setUTCMinutes(0);
      today.setUTCSeconds(0);
      today.setUTCMilliseconds(0);
      var msEnrolled = today - new Date(this.enrollmentDate() + 'T12:00');

      return (msEnrolled / 1000 / 60 / 60 / 24) + 1;
    },

    previousSpanAdherencePct: function(days) {
      var self = this,
          dates = (new Calendar()).dates("iso8601", { days: Math.min(days, this.daysEnrolled()) });
      var doses = _.flatten(_.map(dates, function(d) {
        return _.map(self.getAssignedDoses().getValuesOnDate(d).doses, function(dose) {
          return self.medPromptSurveys.responseStatus(dose, d).status === "positive"
        })
      }));

      return Math.round(100 * _.select(doses).length / doses.length);
    }
  });

  return Participant;
});
