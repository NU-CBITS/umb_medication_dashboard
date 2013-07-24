define([
  "backbone",
  "../../config/resource_locations",
], function(Backbone, Resources) {
  var ParticipantAction = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.environment = options.environment;
      this.appCode = options.appCode;
      this.user = options.user;
    },

    url: function() {
      return Resources[this.environment].urlRoot + this.appCode + "/participants/" + this.user.id + "/latest_action.json";
    },

    parse: function(data, options) {
      var parsed = {};

      _.each(data[0].fields, function(v, k) {
        parsed[k] = v;
      });

      return parsed;
    },

    getEventDateTime: function() {
      return this.get("eventDateTime");
    }
  });

  return ParticipantAction;
});
