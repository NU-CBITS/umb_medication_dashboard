define([
  "backbone",
  "../../../survey_definitions/h2h/cravings_survey",
  "../../../survey_definitions/h2h/med_prompt",
  "../../../survey_definitions/h2h/mood_survey",
  "../../../survey_definitions/h2h/side_effects_survey",
  "lib/date_formatter",
  "text!templates/clinician_alerts/_non_adherence.tpl.html",
  "text!templates/clinician_alerts/_symptoms.tpl.html",
  "text!templates/clinician_alerts/_side_effects.tpl.html",
  "text!templates/clinician_alerts/_cravings.tpl.html",
  "text!templates/clinician_alerts/_mood.tpl.html",
  "moment"
], function(Backbone,
            h2hCravingsSurvey, h2hMedPromptSurvey, h2hMoodSurvey, h2hSideEffectsSurvey,
            DateFormatter, nonAdherenceTpl, symptomsTpl, sideEffectsTpl, cravingsTpl, moodTpl) {
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
      side_effects: _.template(sideEffectsTpl),
      cravings: _.template(cravingsTpl),
      mood: _.template(moodTpl)
    },

    _surveys: {
      non_adherence: h2hMedPromptSurvey,
      side_effects: h2hSideEffectsSurvey,
      mood: h2hMoodSurvey,
      cravings: h2hCravingsSurvey
    },

    _changedInput: function(event) {
      var self = this,
          field = $(event.target).attr("name"),
          value = $(event.target).is(":checked");

      this.model.set(field, value);
      this.model.save()
      .done(function() {
        self.trigger("alert", "success", "Saved.");
      })
      .fail(function() {
        self.trigger("alert", "danger", "Error saving.");
      });
    },

    _hideAlert: function(event) {
      $($(event.target).data("target")).modal("hide");
    },

    _clearAlert: function(event) {
      var self = this;

      this.model.save({ is_cleared: true })
      .done(function() {
        self.trigger("alert", "success", "Saved.");
        self.trigger("cleared");
      })
      .fail(function() {
        self.trigger("alert", "danger", "Error saving.");
      })
      .always(function() {
        self._hideAlert(event);
      });
    }
  });

  return ClinicianAlertView;
});
