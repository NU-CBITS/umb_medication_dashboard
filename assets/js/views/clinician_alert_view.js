define([
  "backbone",
  "../../survey_definitions/ma/med_prompt",
  "../../survey_definitions/ma/side_effects_survey",
  "../../survey_definitions/ma/symptoms_survey",
  "lib/date_formatter",
  "text!templates/clinician_alerts/_non_adherence.tpl.html",
  "text!templates/clinician_alerts/_symptoms.tpl.html",
  "text!templates/clinician_alerts/_side_effects.tpl.html"
], function(Backbone, medPromptSurvey, sideEffectsSurvey, symptomsSurvey,
            DateFormatter, nonAdherenceTpl, symptomsTpl, sideEffectsTpl) {
  var ClinicianAlertView = Backbone.View.extend({
    events: {
      "change input": "_changedInput",
      "click .hide-alert": "_hideAlert",
      "click .clear-alert": "_clearAlert"
    },

    render: function() {
      this.$el.html(this._templates[this.options.alertType]({
        alert: this.model,
        participant: this.participant,
        DateFormatter: DateFormatter,
        survey: this._surveys[this.options.alertType]
      }));

      return this;
    },

    set: function(participant, alert) {
      this.participant = participant;
      this.model = alert;
      this.render();
    },

    _templates: {
      non_adherence: _.template(nonAdherenceTpl),
      symptoms: _.template(symptomsTpl),
      side_effects: _.template(sideEffectsTpl)
    },

    _surveys: {
      non_adherence: medPromptSurvey,
      symptoms: symptomsSurvey,
      side_effects: sideEffectsSurvey
    },

    _changedInput: function(event) {
      var field = $(event.target).attr("name");
      var value = $(event.target).is(":checked");
      this.model.set(field, value);
      this.model.save();
    },

    _hideAlert: function(event) {
      $($(event.target).data("target")).modal("hide");
    },

    _clearAlert: function(event) {
      this.model.save({ is_cleared: true });
      this._hideAlert(event);
      this.trigger("cleared");
    }
  });

  return ClinicianAlertView;
});
