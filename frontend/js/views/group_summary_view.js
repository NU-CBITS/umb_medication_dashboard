define([
  "backbone",
  "views/partials",
  "views/clinician_alert_view",
  "text!templates/group_summary.tpl.html",
], function(Backbone, partials, ClinicianAlertView, template) {
  var GroupSummaryView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "_nonadherenceDueToSideEffects", "_alwaysBotheredBy");
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

    events: {
      "click [data-alert-type]": "_attachAlert"
    },

    className: "span12",

    template: _.template(template),

    render: function() {
      this.$el.html(this.template({
        participants: this.collection,
        nonadherenceDueToSideEffects: this._nonadherenceDueToSideEffects,
        alwaysBotheredBy: this._alwaysBotheredBy,
        partials: partials
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
    }
  });

  return GroupSummaryView;
});
