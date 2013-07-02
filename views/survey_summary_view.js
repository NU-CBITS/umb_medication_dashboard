define([
  "text!templates/_status.tpl.html",
  "text!templates/_sent_messages.tpl.html"
], function(statusTpl, sentMsgsTpl) {
  var SurveySummaryView = {
    initialize: function(options) {
      _.bindAll(this, "render", "_renderSentMessages", "_statusIndicator");
      this.collection.on("sync", this.render);
      options.sentMessages.on("sync", this.render);
    },

    sentMessagesTemplate: _.template(sentMsgsTpl),

    tagName: "tbody",

    render: function() {
      this.$el.html(this.template({
        surveyName: this.options.name,
        survey: this.options.survey,
        dates: this.options.dates,
        statusIndicator: this._statusIndicator
      }));
      this._renderSentMessages();

      return this;
    },

    _renderSentMessages: function() {
      var surveyKey = this.options.survey.name,
          self = this;

      this.$el.find("#sent-messages").html(this.sentMessagesTemplate({
        messageCounts: _.map(this.options.dates, function(date) {
          return self.options.sentMessages.countByContextAndDate(surveyKey, date);
        })
      }));
    },

    _statusIndicator: function(question, date) {
      var responseStatus = this.collection.responseStatus(question, date);
      var elClass = { negative: "bad", missing: "na" }[responseStatus];

      return elClass ? _.template(statusTpl, { elClass: elClass }) : "";
    }
  };

  return SurveySummaryView;
});