define([
  "backbone",
  "lib/date_formatter",
  "text!templates/weekly_participant_summary.tpl.html",
], function(Backbone, DateFormatter, template) {
  var WeeklyParticipantSummaryView = Backbone.View.extend({
    template: _.template(template),

    render: function() {
      this.$el.html(this.template({
        dates: this.options.dates,
        DateFormatter: DateFormatter
      }));

      return this;
    }
  });

  return WeeklyParticipantSummaryView;
});