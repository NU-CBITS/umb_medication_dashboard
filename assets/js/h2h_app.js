requirejs.config({
  baseUrl: "assets/js",
  urlArgs: "bust=" +  (new Date()).getTime(),
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
    bootstrap: "vendor/bootstrap-3.0.0-rc1.min",
    backbone: "vendor/backbone-1.0.0.min",
    jquery: "vendor/jquery-2.0.3.min",
    lodash: "vendor/lodash-1.3.1.min",
    text: "vendor/text-2.0.7",
    moment: "vendor/moment-2.4.0.min"
  }
});

define([
  "../config/resource_locations",
  "../survey_definitions/h2h/side_effects_survey",
  "../survey_definitions/h2h/mood_survey",
  "../survey_definitions/h2h/cravings_survey",
  "../survey_definitions/h2h/med_prompt",
  "views/app_view",
  "router",
  "backbone",
  "collections/participants",
  "lib/django_csrf_helper",
  "bootstrap"
], function(Resources, H2H_SIDE_EFFECTS, H2H_MOOD, H2H_CRAVINGS,
            H2H_MED_PROMPT, AppView, router, Backbone, Participants) {
  var environment = (window.location.search.match(/env=([^&]+)/) || [null, "production"])[1];
  var participants = new Participants([], {
    environment: environment,
    appCode: "heart2haart",
    medPromptSurvey: H2H_MED_PROMPT,
    surveys: [H2H_SIDE_EFFECTS, H2H_MOOD, H2H_CRAVINGS]
  });
  participants.fetchAll()
  .done(function() {
    new AppView({
      environment: environment,
      appCode: "heart2haart",
      router: router,
      participants: participants,
      surveys: ["side_effects", "mood", "cravings"]
    });
    Backbone.history.start({
      root: window.location.pathname
    });
  })
  .fail(function() {
    console.log("failed!");
  });
});
