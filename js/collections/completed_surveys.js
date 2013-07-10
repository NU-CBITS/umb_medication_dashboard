define([
  "backbone",
  "models/completed_survey"
], function(Backbone, CompletedSurvey) {
  var CompletedSurveys = Backbone.Collection.extend({
    model: CompletedSurvey,

    initialize: function(models, options) {
      this.appCode = options.appCode;
      this.surveyPages = options.survey.pages;
      this.surveyName = options.survey.name;
      this.user = options.user;
    },

    url: function() {
      return "http://10.0.1.11/" + this.appCode + "/participants/" + this.user.id + "/" + this.surveyName + "_survey_responses.json";
    },

    responseStatus: function(pageName, date) {
      var self = this, negative, surveys;

      surveys = this._surveysOnDate(date);
      negative = this._isNegative(surveys, pageName);

      return surveys.length ? (negative ? "negative" : "positive") : "missing";
    },

    _surveysOnDate: function(date) {
      return this.where({ date: date });
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

  return CompletedSurveys;
});