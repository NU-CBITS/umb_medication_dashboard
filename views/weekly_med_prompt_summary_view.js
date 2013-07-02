define([
  "backbone",
  "lib/date_formatter",
  "views/survey_summary_view",
  "text!templates/_weekly_med_prompt_summary.tpl.html",
], function(Backbone, DateFormatter, SurveySummaryView, template) {
  var WeeklyMedPromptSummaryView = Backbone.View.extend(
    _.extend(_.clone(SurveySummaryView), {
      template: _.template(template),

      render: function() {
        this.$el.html(this.template({
          doses: this.options.user.doses(),
          dates: this.options.dates,
          statusIndicator: this._statusIndicator,
          DateFormatter: DateFormatter
        }));
        this._renderSentMessages();

        return this;
      }
    })
  );

  return WeeklyMedPromptSummaryView;
});