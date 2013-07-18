define([
  "backbone",
  "models/calendar",
  "collections/participants",
  "text!templates/group_summary.tpl.html",
], function(Backbone, Calendar, Participants, template) {
  var GroupSummaryView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "_nonadherenceDueToSideEffects", "_symptomsAlwaysBother", "_sideEffectsAlwaysBother");
      this.calendar = options.calendar;
      this.render();
    },

    className: "span12",

    template: _.template(template),

    render: function() {
      this.$el.html(this.template({
        participants: this.collection,
        nonadherenceDueToSideEffects: this._nonadherenceDueToSideEffects,
        symptomsAlwaysBother: this._symptomsAlwaysBother,
        sideEffectsAlwaysBother: this._sideEffectsAlwaysBother
      }));

      return this;
    },

    _nonadherenceDueToSideEffects: function(participant) {
      return participant.medPromptSurveys.nonadherenceDueToSideEffects({ dates: this._pastMonth() });
    },

    _symptomsAlwaysBother: function(participant, surveyName) {
      return participant.surveys[surveyName].symptomsAlwaysBother({ dates: this._pastMonth() });
    },

    _sideEffectsAlwaysBother: function(participant, surveyName) {
      return participant.surveys[surveyName].sideEffectsAlwaysBother({ dates: this._pastMonth() });
    },

    _pastMonth: function() {
      return this.calendar.dates("iso8601", { days: Calendar.MONTH });
    }
  });

  return GroupSummaryView;
});
