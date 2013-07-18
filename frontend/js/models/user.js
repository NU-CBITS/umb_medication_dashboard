define([
  "backbone",
  "../../config/resource_locations",
  "models/dose"
], function(Backbone, Resources, Dose) {
  var User = Backbone.Model.extend({
    initialize: function(attributes, options) {
      this.environment = options.environment;
      this.appCode = options.appCode;
    },

    url: function() {
      return Resources[this.environment].urlRoot + this.appCode + "/participants/" + this.id + "/user_config.json";
    },

    doses: function() {
      return _.map(this.get("doses"), function(dose) {
        return new Dose(dose);
      });
    },

    patientId: function() {
      return this._patient().id;
    },

    patientName: function() {
      return this._patient().name;
    },

    dataLastModifiedTimestamp: function() {
      return _.max(this.medPromptSurveys.last().timestamp(),
                   _.max(this.surveys, function(survey) { return survey.last().timestamp(); }),
                   this.messages.last().timestamp());
    },

    _patient: function() {
      return _.find(this.get("people"), { type: "patient" });
    }
  });

  return User;
});
