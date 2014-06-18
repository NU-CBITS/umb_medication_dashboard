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

    // select the latest response for the calendar date
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
      var survey = _.last(takenSurveys),
          negativeSurvey = null;
      if (typeof survey !== 'undefined') {
        var responseLabel = survey.get(pageName);
        var response = this._findResponse(this.survey, pageName, responseLabel);

        if (negativeSurvey = response && response.is_positive === false) {
          negativeSurvey = survey;
        }
      }

      if (negativeSurvey) {
        if (survey.get("model") === "heart2haart.moodsurveyresponse") {
          return responseLabel;
        }

        var nextPage = response.next_page,
            detail = true;

        if (nextPage && nextPage.match(/_frequency$|_distress$/)) {
          detail = negativeSurvey.get(nextPage);
        } else if (negativeSurvey.get('frequency')) {
          detail = negativeSurvey.get('frequency');
          if (negativeSurvey.get('severity')) {
            detail += (', ' + negativeSurvey.get('severity'));
          }
        }

        return detail;
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
