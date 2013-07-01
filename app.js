requirejs.config({
  baseUrl: "",
  shim: {
    "backbone": {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    }
  },
  paths: {
    backbone: "vendor/backbone-1.0.0.min",
    jquery: "vendor/jquery-2.0.2.min",
    lodash: "vendor/lodash-1.3.1.min",
    text: "vendor/text-2.0.7"
  }
});

define([
  "lodash",
  "lib/calendar",
  "lib/date_formatter",
  "survey_definitions/side_effects_survey",
  "survey_definitions/symptoms_survey",
  "models/user",
  "collections/completed_surveys",
  "collections/sent_messages",
  "views/weekly_participant_overview_view",
  "views/weekly_survey_overview_view"
], function(_, Calendar, DateFormatter, SIDE_EFFECTS_SURVEY, SYMPTOMS_SURVEY,
            User, CompletedSurveys, SentMessages, WeeklyParticipantOverviewView,
            WeeklySurveyOverviewView) {
  var UID = "ericcf@gmail.com";

  var rawDates = (new Calendar()).previousDays(7);
  var dates = _.map(rawDates, function(d) { return DateFormatter.iso8601(d); });

  var participantView = new WeeklyParticipantOverviewView({
    el: "#main",
    dates: rawDates
  }).render();

  var user = new User({ url: "http://165.124.171.88:8080/output_files/H2H/ericcf@gmail.com.userCfg.json.txt" });
  user.fetch();

  var completedMedPrompts = new CompletedMedPrompts({ url: "mock_data/medication_surveys.json.txt "})

  var surveys = [
    {
      name: "Side Effects",
      url: "mock_data/side_effects_surveys.json.txt",
      //url: "surveys.cfm?uid=" + UID + "&survey=side_effects",
      definition: SIDE_EFFECTS_SURVEY
    },
    {
      name: "Symptoms",
      url: "mock_data/symptoms_surveys.json.txt",
      //url: "surveys.cfm?uid=" + UID + "&survey=symptoms",
      definition: SYMPTOMS_SURVEY
    }
  ];

  var sentMessages = new SentMessages({
    url: "mock_data/sent_messages.json.txt"
    //url: "messages.cfm?uid=" + UID
  });
  _.each(surveys, function(survey) {
    var completedSurveys = new CompletedSurveys({ url: survey.url });
    var surveysView = (new WeeklySurveyOverviewView({
      collection: completedSurveys,
      name: survey.name,
      survey: survey.definition,
      dates: dates,
      sentMessages: sentMessages
    })).render();

    participantView.$el.find("#participant-overview").append(surveysView.$el);
    completedSurveys.fetch({ parse: true });
  });
  sentMessages.fetch({ parse: true });
});