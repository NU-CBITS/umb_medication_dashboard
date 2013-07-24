define([
  "backbone",
  "../../config/resource_locations",
  "models/clinician_alert"
], function(Backbone, Resources, ClinicianAlert) {
  var ClinicianAlerts = Backbone.Collection.extend({
    model: ClinicianAlert,

    initialize: function(models, options) {
      this.environment = options.environment;
      this.appCode = options.appCode;
      this.user = options.user;
    },

    url: function() {
      return Resources[this.environment].urlRoot + this.appCode + "/participants/" + this.user.id + "/clinician_alerts.json";
    },

    getType: function(type) {
      return this.find(function(a) {
        return a.get("type") === type;
      });
    }
  });

  return ClinicianAlerts;
});
