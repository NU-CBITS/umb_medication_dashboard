define([
  "backbone",
  "models/user",
  "collections/completed_med_prompts",
  "collections/completed_surveys"
], function(Backbone, User, CompletedMedPrompts, CompletedSurveys) {
  var Participants = Backbone.Collection.extend({
    initialize: function(models, options) {
      this.url = options.url;
      this.medPromptSurvey = options.medPromptSurvey;
      this.surveys = options.surveys;
      this.appCode = options.appCode;
    },

    model: User,

    fetchAll: function() {
      var self = this;

      var req = $.getJSON(this.url)
      .then(function(participantIds) {
        var requests = _.map(participantIds, function(id) {
          var participant = new User({ id: id });

          return [
            self.userConfigRequest(participant),
            self.medPromptSurveysRequest(participant),
            self.surveysRequest(participant)
          ];
        });

        return $.when.apply(this, _.flatten(requests));
      });

      return req.then(function() { return self; });
    },

    userConfigRequest: function(participant) {
      var self = this;
      var participantReq = participant.fetch().then(function(p) {
        self.add(participant);
      });

      return participantReq;
    },

    medPromptSurveysRequest: function(participant) {
      participant.medPromptSurveys = new CompletedMedPrompts([], {
        survey: this.medPromptSurvey,
        user: participant,
        appCode: this.appCode
      });

      return participant.medPromptSurveys.fetch({ parse: true });
    },

    surveysRequest: function(participant) {
      var self = this;
      participant.surveys = {};
      var req = _.map(this.surveys, function(survey) {
        participant.surveys[survey.name] = new CompletedSurveys([], {
          survey: survey,
          user: participant,
          appCode: self.appCode
        });

        return participant.surveys[survey.name].fetch({ parse: true });
      });

      return req;
    }
  });

  return Participants;
});