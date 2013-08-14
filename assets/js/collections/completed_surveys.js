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
      negative = this._negativeDetail(surveys, pageName);

      if (surveys.length) {
        if (negative) {
          return {
            status: "negative",
            explain: negative === true ? null : negative
          };
        } else {
          return { status: "positive" };
        }
      } else {
        return { status: "missing", explain: "Patient did not respond to this query." };
      }
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

    _negativeDetail: function(takenSurveys, pageName) {
      var self = this,
          response = null;

      var negativeSurvey = _.find(takenSurveys, function(survey) {
        var responseLabel = survey.get(pageName);
        response = self._findResponse(self.survey, pageName, responseLabel);

        return response && response.is_positive === false;
      });

      if (negativeSurvey) {
        var nextPage = response.next_page;

        if (nextPage && nextPage.match(/_frequency$|_distress$/)) {
          return negativeSurvey.get(nextPage);
        }
        return true;
      }
    },

    _findResponse: function(survey, pageName, responseLabel) {
      return _.find(survey.pages[pageName].responses, {
        label: responseLabel
      });
    }
  });

  return CompletedSurveys;
});
