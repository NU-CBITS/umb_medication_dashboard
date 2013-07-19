define([
  "backbone",
  "../../survey_definitions/ma/med_prompt",
  "lib/date_formatter",
  "models/user",
  "collections/sent_messages",
  "views/weekly_med_prompt_summary_view",
  "views/weekly_survey_summary_view",
  "views/partials",
  "text!templates/weekly_participant_summary.tpl.html",
  "text!templates/_weekly_survey_header.tpl.html",
  "text!templates/_weekly_survey_navigation.tpl.html"
], function(Backbone, MA_MED_PROMPT, DateFormatter, User,
            SentMessages, WeeklyMedPromptSummaryView, WeeklySurveySummaryView,
            partials, template, headerTpl, navTpl) {
  var WeeklyParticipantSummaryView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "_renderNavigation");
      options.calendar.on("periodChanged", this._renderNavigation);
      this.render();

      this.medPromptView = new WeeklyMedPromptSummaryView({
        survey: MA_MED_PROMPT,
        calendar: options.calendar
      });
      this.$("#participant-summary").append(this.medPromptView.$el);

      this.surveyViews = {};
      var self = this;
      _.each(options.surveys, function(surveyName) {
        self.surveyViews[surveyName] = new WeeklySurveySummaryView({
          name: surveyName,
          calendar: options.calendar
        });
        self.$("#participant-summary").append(self.surveyViews[surveyName].$el);
      });
    },

    className: "span12",

    setParticipant: function(model) {
      this.model = model;

      this._renderHeader();

      this.medPromptView.collection = model.medPromptSurveys;
      this.medPromptView.model = model;
      this.medPromptView.render();

      var self = this;
      _.each(this.model.surveys, function(survey, surveyName) {
        self.surveyViews[surveyName].collection = survey;
        self.surveyViews[surveyName].survey = survey.survey;
        self.surveyViews[surveyName].model = model;
        self.surveyViews[surveyName].render();
      });
    },

    events: {
      "click #previous-period": "_previousPeriod",
      "click #next-period": "_nextPeriod"
    },

    template: _.template(template),

    headerTemplate: _.template(headerTpl),

    navTemplate: _.template(navTpl),

    render: function() {
      this.$el.html(this.template());
      this._renderNavigation();

      return this;
    },

    _renderHeader: function() {
      this.$("#header").remove();
      this.$("#participant-summary").before(this.headerTemplate({
        participant: this.model,
        partials: partials
      }));
    },

    _renderNavigation: function() {
      this.$("#summary-header").html(this.navTemplate({
        dates: this.options.calendar.dates(),
        DateFormatter: DateFormatter,
        canGoToNextPeriod: this.options.calendar.canGoToNextPeriod()
      }));
    },

    _previousPeriod: function() {
      this.options.calendar.goToPreviousPeriod();

      return false;
    },

    _nextPeriod: function() {
      this.options.calendar.goToNextPeriod();

      return false;
    }
  });

  return WeeklyParticipantSummaryView;
});
