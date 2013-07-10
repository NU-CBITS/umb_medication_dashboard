define([
  "backbone",
  "lib/date_formatter",
  "models/completed_survey"
], function(Backbone, DateFormatter, CompletedSurvey) {
  var CompletedMedPrompts = Backbone.Collection.extend({
    model: CompletedSurvey,

    initialize: function(models, options) {
      this.appCode = options.appCode;
      this.surveyPages = options.survey.pages;
      this.user = options.user;
    },

    url: function() {
      //return "mock_data/medication_survey_responses_" + this.user.id + ".json.txt";
      return "http://10.0.1.11/" + this.appCode + "/participants/" + this.user.id + "/med_prompt_survey_responses.json";
    },

    responseStatus: function(dose, date) {
      var surveys, negative;

      surveys = this._surveysForDoseOnDate(dose, date);
      negative = this._isNegative(surveys, "index");

      return surveys.length ? (negative ? "negative" : "positive") : "missing";
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