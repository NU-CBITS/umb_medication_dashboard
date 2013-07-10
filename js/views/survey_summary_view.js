define([
  "text!templates/_status.tpl.html",
  "text!templates/_sent_messages.tpl.html"
], function(statusTpl, sentMsgsTpl) {
  var HOVER_TEXT = {
    negative: "Adherence calculation is based only on patients' responses to the prompts. Non-responses to prompts are not included in the denominator of this adherence calculation.",
    missing: "Adherence calculation includes patients' non-responses to prompts. Non-responses are considered nonadherence."
  };

  var SurveySummaryView = {
    initialize: function(options) {
      _.bindAll(this, "_render", "_renderSentMessages", "_statusIndicator");
      this._render(this.collection);
      options.sentMessages.on("sync", this._render);
      options.calendar.on("periodChanged", this._render);
    },

    tagName: "tbody",

    _resourceStatuses: {
      surveys: { ready: false },
      messages: { ready: false }
    },

    _render: function(resource) {
      var resourceType = resource === this.collection ? "surveys" : "messages";
      this._resourceStatuses[resourceType].ready = true;

      if (_.every(this._resourceStatuses, "ready")) {
        this.$el.html(this.template({
          surveyName: this.options.name,
          survey: this.options.survey,
          dates: this.options.calendar.dates("iso8601"),
          statusIndicator: this._statusIndicator
        }));
        this._renderSentMessages();
      }
    },

    _renderSentMessages: function() {
      var surveyKey = this.options.survey.name,
          self = this;

      this.$el.find("#sent-messages").html(this._sentMessagesTemplate({
        messageCounts: _.map(this.options.calendar.dates("iso8601"), function(date) {
          return self.options.sentMessages.countByContextAndDate(surveyKey, date);
        })
      }));
    },

    _sentMessagesTemplate: _.template(sentMsgsTpl),

    _statusIndicator: function(question, date) {
      var responseStatus = this.collection.responseStatus(question, date);
      var elClass = { negative: "bad", missing: "na" }[responseStatus];

      return elClass ? _.template(statusTpl, { elClass: elClass, text: HOVER_TEXT[responseStatus] }) : "";
    }
  };

  return SurveySummaryView;
});