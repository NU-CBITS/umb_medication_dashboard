requirejs.config({
  baseUrl: "js",
  shim: {
    "backbone": {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },
    "bootstrap": {
      deps: ["jquery"],
      exports: "Bootstrap"
    }
  },
  paths: {
    bootstrap: "vendor/bootstrap-2.3.2.min",
    backbone: "vendor/backbone-1.0.0.min",
    jquery: "vendor/jquery-2.0.3.min",
    lodash: "vendor/lodash-1.3.1.min",
    text: "vendor/text-2.0.7"
  }
});

define([
  "../config/resource_locations",
  "../survey_definitions/ma/side_effects_survey",
  "../survey_definitions/ma/symptoms_survey",
  "../survey_definitions/ma/med_prompt",
  "views/app_view",
  "router",
  "backbone",
  "collections/participants",
  "bootstrap"
], function(Resources, MA_SIDE_EFFECTS, MA_SYMPTOMS, MA_MED_PROMPT, AppView, router,
            Backbone, Participants) {
  var environment = (window.location.search.match(/env=([^&]+)/) || [null, "production"])[1];
  var participants = new Participants([], {
    environment: environment,
    appCode: "medactive",
    medPromptSurvey: MA_MED_PROMPT,
    surveys: [MA_SIDE_EFFECTS, MA_SYMPTOMS]
  });
  participants.fetchAll()
  .done(function() {
    new AppView({
      router: router,
      participants: participants,
      surveys: ["side_effects", "symptoms"]
    });
    Backbone.history.start({
      root: window.location.pathname
    });
  })
  .fail(function() {
    console.log("failed!");
  });
});
