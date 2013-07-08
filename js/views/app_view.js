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
        calendar: calendar
      });
      participantView = new WeeklyParticipantSummaryView({
        calendar: calendar
      });
    }

    function setupRouteListeners() {
      options.router.on("route:participantWeeklySummary", participantWeeklySummary);
      options.router.on("route:index", groupSummary);
    }

    function participantWeeklySummary(participantId) {
      //groupView.undelegateEvents();
      groupView.$el.detach();
      $("#main")
      //.empty()
      .append(participantView.$el);
    }

    function groupSummary() {
      //participantView.undelegateEvents();
      participantView.$el.detach();
      $("#main")
      //.empty()
      .append(groupView.$el);
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