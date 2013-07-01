define([
  "backbone",
  "text!templates/_weekly_survey_overview.tpl.html",
  "text!templates/_status.tpl.html",
  "text!templates/_sent_messages.tpl.html"
], function(Backbone, template, statusTpl, sentMsgsTpl) {
  var WeeklySurveyOverviewView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "render", "_renderSentMessages", "_statusIndicator");
      this.collection.on("sync", this.render);
      options.sentMessages.on("sync", this._renderSentMessages);
    },

    template: _.template(template),

    sentMessagesTemplate: _.template(sentMsgsTpl),

    tagName: "tbody",

    render: function() {
      this.$el.html(this.template({
        surveyName: this.options.name,
        survey: this.options.survey,
        dates: this.options.dates,
        statusIndicator: this._statusIndicator
      }));

      return this;
    },

    _renderSentMessages: function(sentMessages) {
      var surveyKey = this.options.survey.name;

      this.$el.find("#sent-messages").html(this.sentMessagesTemplate({
        messageCounts: _.map(this.options.dates, function(date) {
          return sentMessages.countByContextAndDate(surveyKey, date);
        })
      }));
    },

    _statusIndicator: function(question, date) {
      var filter = { timestarted: date };
      var surveysOnDate = this.collection.where(filter);
      var negative = _.any(surveysOnDate, function(response) {
        return response.get(question);
      });
      var elClass = surveysOnDate.length === 0 ? "na" : (negative && "bad");

      return elClass ? _.template(statusTpl, { elClass: elClass }) : "";
    }
  });

  return WeeklySurveyOverviewView;
});