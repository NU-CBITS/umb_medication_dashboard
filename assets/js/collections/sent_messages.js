define([
  "backbone",
  "../../config/resource_locations",
  "models/sent_message"
], function(Backbone, Resources, SentMessage) {
  var SentMessages = Backbone.Collection.extend({
    model: SentMessage,

    initialize: function(models, options) {
      this.environment = options.environment;
      this.appCode = options.appCode;
      this.user = options.user;
    },

    comparator: function(message) {
      return message.timestamp();
    },

    url: function() {
      return Resources[this.environment].urlRoot + this.appCode + "/participants/" + this.user.id + "/sent_messages.json";
    },

    countByContextAndDate: function(context, date) {
      return this.where({ context: context, date: date }).length;
    }
  });

  return SentMessages;
});
