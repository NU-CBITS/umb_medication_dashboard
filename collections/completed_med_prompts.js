define([
  "backbone",
  "models/completed_survey"
], function(Backbone, CompletedSurvey) {
  var CompletedMedPrompts = Backbone.Collection.extend({
    model: CompletedSurvey,

    initialize: function(options) {
      this.url = options.url;
      this.surveyPages = options.survey.pages;
      this.user = options.user;
    },

    responseStatus: function(dose, date) {
      var surveys, negative;

      surveys = this._surveysOnDate(date);
      negative = this._isNonadherent(surveys);

      return surveys.length ? (negative ? "negative" : "positive") : "missing";
    },

    _surveysOnDate: function(date) {
      return this.where({ date: date });
    },

    _isNonadherent: function(surveys) {
      var self = this;

      return _.any(this.user.doses(), function(dose) {
        function atTime(survey) { return survey.get("dosetime") === dose.time; }
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