define([
  "backbone",
  "models/sent_message"
], function(Backbone, SentMessage) {
  var SentMessages = Backbone.Collection.extend({
    model: SentMessage,

    initialize: function(options) {
      this.url = options.url;
    },

    countByContextAndDate: function(context, date) {
      return this.where({ context: context, date: date }).length;
    }
  });

  return SentMessages;
});