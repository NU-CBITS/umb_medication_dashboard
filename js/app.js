requirejs.config({
  baseUrl: "js",
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
  "jquery",
  "models/calendar",
  "../survey_definitions/ma/side_effects_survey",
  "../survey_definitions/ma/symptoms_survey",
  "../survey_definitions/ma/med_prompt",
  "models/user",
  "collections/completed_surveys",
  "collections/completed_med_prompts",
  "collections/sent_messages",
  "views/weekly_participant_summary_view",
  "views/weekly_med_prompt_summary_view",
  "views/weekly_survey_summary_view"
], function($, Calendar, SIDE_EFFECTS_SURVEY, SYMPTOMS_SURVEY,
            MED_PROMPT_SURVEY, User, CompletedSurveys, CompletedMedPrompts,
            SentMessages, WeeklyParticipantSummaryView,
            WeeklyMedPromptSummaryView, WeeklySurveySummaryView) {
  var UID = "ericcf@gmail.com";

  var calendar = new Calendar();

  var participantView = new WeeklyParticipantSummaryView({
    el: "#main",
    calendar: calendar
  }).render();

  var user = new User({
    url: "mock_data/user_config.json.txt"
    //url: "http://165.124.171.88:8080/output_files/H2H/ericcf@gmail.com.userCfg.json.txt"
  });
  var sentMessages = new SentMessages({
    url: "mock_data/ma/sent_messages.json.txt"
    //url: "messages.cfm?uid=" + UID
  });

  var completedMedPrompts = new CompletedMedPrompts({
    url: "mock_data/medication_surveys.json.txt",
    survey: MED_PROMPT_SURVEY,
    user: user
  });
  var medPromptView = (new WeeklyMedPromptSummaryView({
    collection: completedMedPrompts,
    survey: MED_PROMPT_SURVEY,
    calendar: calendar,
    sentMessages: sentMessages,
    user: user
  }));
  participantView.$el.find("#participant-summary").append(medPromptView.$el);

  user.fetch({
    success: function() {
      $("#header").text("Summary for " + user.patientName());
      completedMedPrompts.fetch({ parse: true });
    }
  });

  var surveys = [
    {
      name: "Side Effects",
      url: "mock_data/ma/side_effects_surveys.json.txt",
      //url: "surveys.cfm?uid=" + UID + "&survey=side_effects",
      definition: SIDE_EFFECTS_SURVEY
    },
    {
      name: "Symptoms",
      url: "mock_data/ma/symptoms_surveys.json.txt",
      //url: "surveys.cfm?uid=" + UID + "&survey=symptoms",
      definition: SYMPTOMS_SURVEY
    }
  ];

  _.each(surveys, function(survey) {
    var completedSurveys = new CompletedSurveys({
      url: survey.url,
      survey: survey.definition
    });
    var surveysView = (new WeeklySurveySummaryView({
      collection: completedSurveys,
      name: survey.name,
      survey: survey.definition,
      calendar: calendar,
      sentMessages: sentMessages
    }));

    participantView.$el.find("#participant-summary").append(surveysView.$el);
    completedSurveys.fetch({ parse: true });
  });
  sentMessages.fetch({ parse: true });
});