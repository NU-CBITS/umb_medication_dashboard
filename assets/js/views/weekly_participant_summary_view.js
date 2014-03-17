define([
  "backbone",
  "../../survey_definitions/ma/med_prompt",
  "lib/date_formatter",
  "models/participant",
  "collections/sent_messages",
  "views/weekly_med_prompt_summary_view",
  "views/weekly_survey_summary_view",
  "views/help_modal_partial",
  "views/title_row_partial",
  "text!h2h/templates/weekly_participant_summary.tpl.html",
  "text!ma/templates/weekly_participant_summary.tpl.html",
  "text!templates/_weekly_survey_header.tpl.html",
  "text!templates/_weekly_survey_navigation.tpl.html"
], function(Backbone, MA_MED_PROMPT, DateFormatter, Participant,
            SentMessages, WeeklyMedPromptSummaryView, WeeklySurveySummaryView,
            HelpModalPartial, titleRowPartial, h2hTpl, maTpl, headerTpl, navTpl) {
  var WeeklyParticipantSummaryView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "_renderNavigation");
      options.calendar.on("periodChanged", this._renderNavigation);
      this.helpModal = new HelpModalPartial({
        environment: this.options.environment,
        appCode: this.options.appCode
      });
      this.render();

      this.medPromptView = new WeeklyMedPromptSummaryView({
        survey: MA_MED_PROMPT,
        calendar: options.calendar,
        environment: this.options.environment,
        appCode: this.options.appCode
      });
      this.medPromptView.on("alert", function(type, message) {
        self.trigger("alert", type, message);
      });
      this.medPromptView.$el.addClass("active");
      this.medPromptView.$el.attr("id", "medication");
      this.$("#participant-summary").append(this.medPromptView.$el);

      this.surveyViews = {};
      var self = this;
      _.each(options.surveys, function(surveyName) {
        self.surveyViews[surveyName] = new WeeklySurveySummaryView({
          name: surveyName,
          calendar: options.calendar
        });
        self.surveyViews[surveyName].$el.attr("id", surveyName);
        self.$("#participant-summary").append(self.surveyViews[surveyName].$el);
      });
    },

    className: "col-lg-12",

    setParticipant: function(model) {
      this.model = model;

      this.$("#header").html("Summary for " + this.model.patientName());

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

    events: function() {
      return _.extend({
        "click #previous-period": "_previousPeriod",
        "click #next-period": "_nextPeriod"
      }, this.helpModal.events);
    },

    templates:{
      medactive: _.template(maTpl),
      heart2haart: _.template(h2hTpl)
    },

    headerTemplate: _.template(headerTpl),

    navTemplate: _.template(navTpl),

    render: function() {
      this.$el.html(this.templates[this.options.appCode]());
      this._renderNavigation();
      this._renderHeader();
      var self = this;
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        var tabName = e.target.href.split('#')[1];
        var app = self.options.appCode.toLowerCase();
        $.ajax({
          url: '/umb/' + app + '/participants/' + self.model.id + '/tab_click',
          data: JSON.stringify({ name: tabName }),
          type: 'POST',
          dataType: 'json'
        });
      });

      return this;
    },

    _renderHeader: function() {
      this.$(".nav-tabs").before(this.headerTemplate({
        helpModal: this.helpModal,
        titleRow: titleRowPartial
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
