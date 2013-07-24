define([
  "backbone",
  "../../config/resource_locations",
  "models/completed_survey"
], function(Backbone, Resources, CompletedSurvey) {
  var CompletedSurveys = Backbone.Collection.extend({
    model: CompletedSurvey,

    initialize: function(models, options) {
      this.environment = options.environment;
      this.appCode = options.appCode;
      this.survey = options.survey;
      this.user = options.user;
    },

    comparator: function(survey) {
      return survey.timestamp();
    },

    url: function() {
      return Resources[this.environment].urlRoot + this.appCode + "/participants/" + this.user.id + "/" + this.survey.name + "_survey_responses";
    },

    responseStatus: function(pageName, date) {
      var self = this, negative, surveys;

      surveys = this._surveysOnDate(date);
      negative = this._isNegative(surveys, pageName);

      return surveys.length ? (negative ? "negative" : "positive") : "missing";
    },

    alwaysBotheredBy: function(options) {
      return this.any(function(survey) {
        return _.contains(options.dates, survey.date()) &&
          survey.alwaysBotheredBy(options.problem);
      });
    },

    _surveysOnDate: function(date) {
      return this.where({ date: date });
    },

    _isNegative: function(surveys, pageName) {
      var self = this;

      return _.any(surveys, function(response) {
        return (_.find(self.survey.pages[pageName].responses, {
          label: response.get(pageName)
        }).is_positive === false);
      });
    }
  });

  return CompletedSurveys;
});
