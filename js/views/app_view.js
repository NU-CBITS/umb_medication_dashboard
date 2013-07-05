define([
  "models/calendar",
  "views/weekly_participant_summary_view"
], function(Calendar, WeeklyParticipantSummaryView) {
  function AppView(options) {
    var participantView = new WeeklyParticipantSummaryView({
      calendar: new Calendar()
    });
    options.router.on("route:participantWeeklySummary", participantWeeklySummary);
    options.router.on("route:index", participantWeeklySummary);

    function participantWeeklySummary(participantId) {
      $("#main")
      .empty()
      .append(participantView.$el);
    }
  };

  return AppView;
});