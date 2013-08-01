define([
  "lodash",
  "models/calendar",
  "views/group_summary_view",
  "views/weekly_participant_summary_view"
], function(_, Calendar, GroupSummaryView, WeeklyParticipantSummaryView) {
  function AppView(options) {
    var views = {},
        currentView;

    createViews();
    setupAlertListeners();
    setupRouteListeners();

    function createViews() {
      var calendar = new Calendar();
      views.group = new GroupSummaryView({
        environment: options.environment,
        appCode: options.appCode,
        calendar: calendar,
        collection: options.participants
      });
      views.participant = new WeeklyParticipantSummaryView({
        environment: options.environment,
        appCode: options.appCode,
        calendar: calendar,
        surveys: options.surveys
      });
    }

    function setupAlertListeners() {
      _.each(views, function(view, name) {
        view.on("alert", renderAlert);
      });
    }

    function renderAlert(type, message) {
      $("#alert-container")
      .html("<div class=\"alert alert-block alert-" + type + "\">" + message + "</div>");
    }

    function setupRouteListeners() {
      options.router.on("route:participantWeeklySummary", participantWeeklySummary);
      options.router.on("route:index", groupSummary);
    }

    function participantWeeklySummary(participantId) {
      views.participant.setParticipant(options.participants.get(participantId));
      replaceView(views.participant);
    }

    function groupSummary() {
      replaceView(views.group);
      $("#group-summary-menu-item").addClass("active");
    }

    function replaceView(view) {
      $(".nav.navbar-nav > li").removeClass("active");
      emptyAlertBlock();
      currentView && currentView.$el.detach();
      $("#main").append(view.$el);
      currentView = view;
    }

    function emptyAlertBlock() {
      $("#alert-container").html("");
    }
  };

  return AppView;
});
