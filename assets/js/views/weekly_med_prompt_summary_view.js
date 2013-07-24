define([
  "backbone",
  "lib/date_formatter",
  "views/survey_summary_view",
  "text!templates/_weekly_med_prompt_summary.tpl.html",
], function(Backbone, DateFormatter, SurveySummaryView, template) {
  var WeeklyMedPromptSummaryView = Backbone.View.extend(
    _.extend(_.clone(SurveySummaryView), {
      template: _.template(template),

      survey: { name: "medication" },

      render: function() {
        this.$el.html(this.template({
          doses: this.model.doses(),
          dates: this.options.calendar.dates("iso8601"),
          statusIndicator: this._statusIndicator,
          DateFormatter: DateFormatter
        }));
        this._renderSentMessages();
      }
    })
  );

  return WeeklyMedPromptSummaryView;
});
