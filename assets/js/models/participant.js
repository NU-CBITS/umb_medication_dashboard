define([
  "backbone",
  "models/calendar",
  "lib/date_formatter"
], function(Backbone, Calendar, DateFormatter) {
  var Participant = Backbone.Model.extend({
    initialize: function(attributes, options) {
      this.latestAction = null;
      this.assignedDoses = [];
    },

    patientId: function() {
      return this.id;
    },

    patientName: function() {
      return (this.get('first_name') || '') + ' ' + (this.get('last_name') || '').slice(0, 1);
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
          dates = (new Calendar()).dates("iso8601", { days: Math.min(days, this.daysEnrolled()) }),
          dateToday = DateFormatter.iso8601(new Date),
          timeNow = DateFormatter.rawTimeString(new Date);

      var doses = _.flatten(_.map(dates, function(d) {
        var valuesOnDate = self.getAssignedDoses().getValuesOnDate(d) || { doses: [] };
        var pastDoses = _.select(valuesOnDate.doses, function(dose) {
          return d < dateToday || (d == dateToday && dose.rawTime <= timeNow);
        });

        return _.map(pastDoses, function(dose) {
          return self.medPromptSurveys.responseStatus(dose, d).status === "positive"
        })
      }));

      return Math.round(100 * _.select(doses).length / doses.length);
    }
  });

  return Participant;
});
