define([
  "backbone",
  "lib/date_formatter",
  "text!templates/weekly_participant_summary.tpl.html",
  "text!templates/_weekly_survey_header.tpl.html"
], function(Backbone, DateFormatter, template, headerTpl) {
  var WeeklyParticipantSummaryView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "render", "_renderHeader");
      options.calendar.on("periodChanged", this._renderHeader);
    },

    events: {
      "click #previous-period": "_previousPeriod",
      "click #next-period": "_nextPeriod"
    },

    template: _.template(template),

    headerTemplate: _.template(headerTpl),

    render: function() {
      this.$el.html(this.template());
      this._renderHeader();

      return this;
    },

    _renderHeader: function() {
      this.$el.find("#summary-header").html(this.headerTemplate({
        dates: this.options.calendar.dates(),
        DateFormatter: DateFormatter
      }));
    },

    _previousPeriod: function() {
      this.options.calendar.goToPreviousPeriod();

      return false;
    },

    _nextPeriod: function() {
      this.options.calendar.goToNextPeriod();

      return false;
    }
  });

  return WeeklyParticipantSummaryView;
});