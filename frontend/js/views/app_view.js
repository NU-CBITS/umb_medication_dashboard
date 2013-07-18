define([
  "models/calendar",
  "views/group_summary_view",
  "views/weekly_participant_summary_view"
], function(Calendar, GroupSummaryView, WeeklyParticipantSummaryView) {
  function AppView(options) {
    var groupView, participantView;

    createViews();
    setupRouteListeners();
    setupDocumentListeners();

    function createViews() {
      var calendar = new Calendar();
      groupView = new GroupSummaryView({
        calendar: calendar,
        collection: options.participants
      });
      participantView = new WeeklyParticipantSummaryView({
        calendar: calendar,
        surveys: options.surveys
      });
    }

    function setupRouteListeners() {
      options.router.on("route:participantWeeklySummary", participantWeeklySummary);
      options.router.on("route:index", groupSummary);
    }

    function participantWeeklySummary(participantId) {
      groupView.$el.detach();
      participantView.setParticipant(options.participants.get(participantId));
      $("#main").append(participantView.$el);
    }

    function groupSummary() {
      participantView.$el.detach();
      $("#main").append(groupView.$el);
    }

    function setupDocumentListeners() {
      $(document).on("click", "#view-all", function(event) {
        event.preventDefault();
        options.router.navigate("/", { trigger: true });
      });
      $(document).on("click", ".view-details", function(event) {
        event.preventDefault();
        options.router.navigate($(event.target).attr("href"), { trigger: true });
      });
    }
  };

  return AppView;
});
