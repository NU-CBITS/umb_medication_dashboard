define([
  "backbone",
  "../../config/resource_locations"
], function(Backbone, Resources) {
  var ChangeMedicationRequest = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.environment = options.environment;
      this.appCode = options.appCode;
      this.getUserId = options.getUserId;
    },

    url: function() {
      return Resources[this.environment].urlRoot + this.appCode + "/participants/" + this.getUserId() + "/change_medication_requests";
    }
  });

  return ChangeMedicationRequest;
});

