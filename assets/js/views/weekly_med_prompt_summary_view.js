define([
  "backbone",
  "lib/date_formatter",
  "views/survey_summary_view",
  "views/change_medication_view",
  "text!templates/_weekly_med_prompt_summary.tpl.html",
], function(Backbone, DateFormatter, SurveySummaryView, ChangeMedicationView,
            template) {
  var WeeklyMedPromptSummaryView = Backbone.View.extend(
    _.extend(_.clone(SurveySummaryView), {
      template: _.template(template),

      survey: { name: "medication" },

      render: function() {
        var self = this;
        this.$el.html(this.template({
          dosesOnDate: function(date) { return self.model.getAssignedDoses().getValuesOnDate(date).doses; },
          dates: this.options.calendar.dates("iso8601"),
          statusIndicator: this._statusIndicator,
          DateFormatter: DateFormatter
        }));
        this._renderSentMessages();
        new ChangeMedicationView({
          environment: this.options.environment,
          appCode: this.options.appCode,
          getUserId: function() { return self.model.id; }
        });
      }
    })
  );

  return WeeklyMedPromptSummaryView;
});
