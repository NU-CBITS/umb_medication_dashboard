define([
  "backbone",
  "lib/date_formatter",
  "text!templates/weekly_participant_overview.tpl.html",
], function(Backbone, DateFormatter, template) {
  var WeeklyParticipantOverviewView = Backbone.View.extend({
    template: _.template(template),

    render: function() {
      this.$el.html(this.template({
        dates: this.options.dates,
        DateFormatter: DateFormatter
      }));

      return this;
    }
  });

  return WeeklyParticipantOverviewView;
});