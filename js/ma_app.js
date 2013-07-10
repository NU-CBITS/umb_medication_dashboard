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
    jquery: "vendor/jquery-2.0.3.min",
    lodash: "vendor/lodash-1.3.1.min",
    text: "vendor/text-2.0.7"
  }
});

define([
  "../survey_definitions/ma/side_effects_survey",
  "../survey_definitions/ma/symptoms_survey",
  "../survey_definitions/ma/med_prompt",
  "views/app_view",
  "router",
  "backbone",
  "collections/participants"
], function(MA_SIDE_EFFECTS, MA_SYMPTOMS, MA_MED_PROMPT, AppView, router,
            Backbone, Participants) {
  var participants = new Participants([], {
    url: "http://10.0.1.11/medactive/participants.json",
    appCode: "medactive",
    medPromptSurvey: MA_MED_PROMPT,
    surveys: [MA_SIDE_EFFECTS, MA_SYMPTOMS]
  });
  participants.fetchAll()
  .done(function() {
    new AppView({ router: router, participants: participants });
    Backbone.history.start({
      root: window.location.pathname,
      pushState: true
    });
  });
});