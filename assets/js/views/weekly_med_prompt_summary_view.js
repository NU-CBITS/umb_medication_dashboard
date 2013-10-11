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
          DateFormatter: DateFormatter,
          participant: this.model,
          unitChoices: {
            medactive: ['mg','g','mcg'],
            heart2haart: ['dose','mg']
          }[this.options.appCode],
          medChoices: {
            medactive: ['Chlorpromazine (Thorazine)','Fluphenazine (Prolixin)','Haloperidol (Haldol)','Loxapine (Loxitane)','Mesoridazine (Serentil)','Perphenazine (Trilafon)','Thioridazine (Mellaril)','Thiothixene (Navane)','Trifluoperazine (Stelazine)','Asenapine (Saphris)','Clozapine (Clozaril)','Iloperidone (Fanapt)','Olanzapine (Zyprexa)','Paliperidone (Invega)','Quetiapine (Seroquel)','Risperidone (Risperdal)','Ziprasidone (Geodon)','Aripiprazole (Abilify)','Lurasidone (Latuda)'],
            heart2haart: ['Atripla','Complera','Stribild','Combivir','Emtriva','Epivir','Epzicom','Hivid','Retrovir','Trizivir','Truvada','Videx EC','Videx','Viread','Zerit','Ziagen','Edurant','Intelence','Rescriptor','Sustiva','Viramune','Agenerase','Aptivus','Crixivan','Fortovase','Invirase','Kaletra','Lexiva','Norvir','Prezista','Reyataz','Viracept','Selzentry','Isentress','Tivicay']
          }[this.options.appCode]
        }));
        this._renderSentMessages();
        this.changeMedicationView = new ChangeMedicationView({
          environment: this.options.environment,
          appCode: this.options.appCode,
          getUserId: function() { return self.model.id; }
        });
        this.changeMedicationView.on("alert", function(type, message) {
          self.trigger("alert", type, message);
        });
      }
    })
  );

  return WeeklyMedPromptSummaryView;
});
