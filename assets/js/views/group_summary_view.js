define([
  "backbone",
  "lib/date_formatter",
  "views/help_modal_partial",
  "views/clinician_alert_view",
  "text!templates/group_summary.tpl.html",
], function(Backbone, DateFormatter, HelpModalPartial, ClinicianAlertView, template) {
  var GroupSummaryView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "_nonadherenceDueToSideEffects", "_alwaysBotheredBy");
      this.helpModal = new HelpModalPartial({
        environment: this.options.environment,
        appCode: this.options.appCode
      });
      this.render();
      this.alertViews = {
        non_adherence: new ClinicianAlertView({ alertType: "non_adherence" }),
        symptoms: new ClinicianAlertView({ alertType: "symptoms" }),
        side_effects: new ClinicianAlertView({ alertType: "side_effects" })
      };
      this.$("#non-adherence-alert").html(this.alertViews.non_adherence.$el);
      this.$("#symptoms-alert").html(this.alertViews.symptoms.$el);
      this.$("#side-effects-alert").html(this.alertViews.side_effects.$el);
    },

    events: function() {
      return _.extend({
        "click [data-alert-type]": "_attachAlert"
      }, this.helpModal.events);
    },

    className: "span12",

    template: _.template(template),

    render: function() {
      this.$el.html(this.template({
        participants: this.collection,
        nonadherenceDueToSideEffects: this._nonadherenceDueToSideEffects,
        alwaysBotheredBy: this._alwaysBotheredBy,
        previousWeekAdherencePct: this._previousWeekAdherencePct,
        previousMonthAdherencePct: this._previousMonthAdherencePct,
        helpModal: this.helpModal,
        DateFormatter: DateFormatter
      }));

      return this;
    },

    _nonadherenceDueToSideEffects: function(participant) {
      return participant.clinicianAlerts.getType("non_adherence");
    },

    _alwaysBotheredBy: function(participant, surveyName) {
      return participant.clinicianAlerts.getType(surveyName);
    },

    _attachAlert: function(event) {
      var options = $(event.currentTarget).data();
      var participant = this.collection.get(options.participantId);
      var alert = participant.clinicianAlerts.getType(options.alertType);
      this.alertViews[options.alertType].set(participant, alert);
      $(options.target).modal("show");
    },

    _previousWeekAdherencePct: function(participant) {
      var dates = (new Calendar()).dates("iso8601");

      return _.filter(participant.assignedDoseHistory, function(dose) {
        return _.contains(dates, dose.date) && wasTaken(assignedDose);
      });
    },

    _previousMonthAdherencePct: function(participant) {
    }
  });

  return GroupSummaryView;
});
