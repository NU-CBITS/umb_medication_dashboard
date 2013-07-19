define([
  "backbone",
  "../../config/resource_locations",
  "models/user",
  "collections/completed_med_prompts",
  "collections/completed_surveys",
  "collections/sent_messages",
  "collections/clinician_alerts"
], function(Backbone, Resources, User, CompletedMedPrompts, CompletedSurveys,
            SentMessages, ClinicianAlerts) {
  var Participants = Backbone.Collection.extend({
    initialize: function(models, options) {
      this.environment = options.environment;
      this.medPromptSurvey = options.medPromptSurvey;
      this.surveys = options.surveys;
      this.appCode = options.appCode;
    },

    model: User,

    url: function() {
      return Resources[this.environment].urlRoot + this.appCode + "/participants.json";
    },

    fetchAll: function() {
      var self = this;

      var req = $.getJSON(this.url())
      .then(function(participantIds) {
        var requests = _.map(participantIds, function(id) {
          var participant = new User({
            id: id
          }, {
            environment: self.environment,
            appCode: self.appCode
          });

          return [
            self.userConfigRequest(participant),
            self.medPromptSurveysRequest(participant),
            self.surveysRequest(participant),
            self.messagesRequest(participant),
            self.alertsRequest(participant)
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
        environment: this.environment,
        appCode: this.appCode,
        user: participant,
        survey: this.medPromptSurvey
      });

      return participant.medPromptSurveys.fetch({ parse: true });
    },

    surveysRequest: function(participant) {
      var self = this;
      participant.surveys = {};
      var requests = _.map(this.surveys, function(survey) {
        participant.surveys[survey.name] = new CompletedSurveys([], {
          environment: self.environment,
          appCode: self.appCode,
          user: participant,
          survey: survey
        });

        return participant.surveys[survey.name].fetch({ parse: true });
      });

      return requests;
    },

    messagesRequest: function(participant) {
      participant.messages = new SentMessages([], {
        environment: this.environment,
        appCode: this.appCode,
        user: participant
      });

      return participant.messages.fetch({ parse: true });
    },

    alertsRequest: function(participant) {
      participant.clinicianAlerts = new ClinicianAlerts([], {
        environment: this.environment,
        appCode: this.appCode,
        user: participant
      });

      return participant.clinicianAlerts.fetch({ parse: true });
    }
  });

  return Participants;
});
