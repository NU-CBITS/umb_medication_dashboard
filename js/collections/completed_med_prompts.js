define([
  "backbone",
  "../../config/resource_locations",
  "lib/date_formatter",
  "models/completed_med_prompt"
], function(Backbone, Resources, DateFormatter, CompletedMedPrompt) {
  var CompletedMedPrompts = Backbone.Collection.extend({
    model: CompletedMedPrompt,

    initialize: function(models, options) {
      this.environment = options.environment;
      this.appCode = options.appCode;
      this.surveyPages = options.survey.pages;
      this.user = options.user;
    },

    url: function() {
      return Resources[this.environment].urlRoot + this.appCode + "/participants/" + this.user.id + "/med_prompt_survey_responses.json";
    },

    responseStatus: function(dose, date) {
      var surveys, negative;

      surveys = this._surveysForDoseOnDate(dose, date);
      negative = this._isNegative(surveys, "index");

      return surveys.length ? (negative ? "negative" : "positive") : "missing";
    },

    nonadherenceDueToSideEffects: function(options) {
      var surveys = this.filter(function(survey) {
        return _.contains(options.dates, survey.date()) &&
          survey.nonadherenceDueToSideEffects();
      });

      return _.map(surveys, function(s) { return s.date(); });
    },

    _surveysForDoseOnDate: function(dose, date) {
      return this.select(function(survey) {
        return survey.get("date") === date &&
          DateFormatter.timeStringToMeridian(survey.doseTime()) === dose.time();
      });
    },

    _isNonadherent: function(surveys) {
      var self = this;

      return _.any(this.user.doses(), function(dose) {
        function atTime(survey) { return DateFormatter.timeStringToMeridian(survey.doseTime()) === dose.time(); }
        return !_.find(surveys, atTime) ||
          self._isNegative(_.filter(surveys, atTime), "index");
      });
    },

    _isNegative: function(surveys, pageName) {
      var self = this;

      return _.any(surveys, function(response) {
        return (_.find(self.surveyPages[pageName].responses, {
          label: response.get(pageName)
        }).is_positive === false);
      });
    }
  });

  return CompletedMedPrompts;
});
