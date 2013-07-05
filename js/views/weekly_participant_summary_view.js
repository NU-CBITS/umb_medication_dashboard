define([
  "backbone",
  "../../survey_definitions/ma/side_effects_survey",
  "../../survey_definitions/ma/symptoms_survey",
  "../../survey_definitions/ma/med_prompt",
  "lib/date_formatter",
  "models/user",
  "collections/completed_surveys",
  "collections/completed_med_prompts",
  "collections/sent_messages",
  "views/weekly_med_prompt_summary_view",
  "views/weekly_survey_summary_view",
  "text!templates/weekly_participant_summary.tpl.html",
  "text!templates/_weekly_survey_header.tpl.html"
], function(Backbone, MA_SIDE_EFFECTS, MA_SYMPTOMS, MA_MED_PROMPT,
            DateFormatter, User, CompletedSurveys, CompletedMedPrompts,
            SentMessages, WeeklyMedPromptSummaryView, WeeklySurveySummaryView,
            template, headerTpl) {
  var WeeklyParticipantSummaryView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "_renderHeader");
      options.calendar.on("periodChanged", this._renderHeader);
      this.render();
      var self = this;

      var UID = "ericcf@gmail.com";

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
        survey: MA_MED_PROMPT,
        user: user
      });
      var medPromptView = (new WeeklyMedPromptSummaryView({
        collection: completedMedPrompts,
        survey: MA_MED_PROMPT,
        calendar: options.calendar,
        sentMessages: sentMessages,
        user: user
      }));
      this.$el.find("#participant-summary").append(medPromptView.$el);

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
          definition: MA_SIDE_EFFECTS
        },
        {
          name: "Symptoms",
          url: "mock_data/ma/symptoms_surveys.json.txt",
          //url: "surveys.cfm?uid=" + UID + "&survey=symptoms",
          definition: MA_SYMPTOMS
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
          calendar: options.calendar,
          sentMessages: sentMessages
        }));

        self.$el.find("#participant-summary").append(surveysView.$el);
        completedSurveys.fetch({ parse: true });
      });
      sentMessages.fetch({ parse: true });
    },

    events: {
      "click #previous-period": "_previousPeriod",
      "click #next-period": "_nextPeriod"
    },

    template: _.template(template),

    headerTemplate: _.template(headerTpl),

    render: function() {
      this.$el.html(this.template());
      this._renderHeader();

      return this;
    },

    _renderHeader: function() {
      this.$el.find("#summary-header").html(this.headerTemplate({
        dates: this.options.calendar.dates(),
        DateFormatter: DateFormatter
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