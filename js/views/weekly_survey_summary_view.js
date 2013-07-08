define([
  "backbone",
  "views/survey_summary_view",
  "text!templates/_weekly_survey_overview.tpl.html",
], function(Backbone, SurveySummaryView, template) {
  SurveySummaryView.template = _.template(template);
  var WeeklySurveySummaryView = Backbone.View.extend(
    SurveySummaryView
  );

  return WeeklySurveySummaryView;
});