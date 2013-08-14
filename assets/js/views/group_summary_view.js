define([
  "backbone",
  "lib/date_formatter",
  "views/help_modal_partial",
  "views/title_row_partial",
  "views/clinician_alert_view",
  "text!h2h/templates/group_summary.tpl.html",
  "text!ma/templates/group_summary.tpl.html",
  "text!templates/partials/_participants_dropdown.tpl.html",
], function(Backbone, DateFormatter, HelpModalPartial,
            titleRowPartial, ClinicianAlertView, h2hTpl, maTpl,
            ParticipantsDropdownTpl) {
  var GroupSummaryView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "_nonadherenceDueToSideEffects", "_alwaysBotheredBy");
      this.helpModal = new HelpModalPartial({
        environment: this.options.environment,
        appCode: this.options.appCode
      });
      this.render();
      this.alertViews = {
        non_adherence: new ClinicianAlertView({ alertType: "non_adherence" })
      };
      this.$("#non-adherence-alert").html(this.alertViews.non_adherence.$el);
      var self = this;
      _.each(options.surveys, function(surveyName) {
        self.alertViews[surveyName] = new ClinicianAlertView({ alertType: surveyName });
        self.$("#" + surveyName + "-alert").html(self.alertViews[surveyName].$el);
      });
    },

    events: function() {
      return _.extend({
        "click [data-alert-type]": "_attachAlert"
      }, this.helpModal.events);
    },

    className: "col-lg-12",

    templates: {
      heart2haart: _.template(h2hTpl),
      medactive: _.template(maTpl)
    },

    participantsDropdownTpl: _.template(ParticipantsDropdownTpl),

    render: function() {
      this.$el.html(this.templates[this.options.appCode]({
        participants: this.collection,
        nonadherenceDueToSideEffects: this._nonadherenceDueToSideEffects,
        alwaysBotheredBy: this._alwaysBotheredBy,
        helpModal: this.helpModal,
        DateFormatter: DateFormatter,
        titleRow: titleRowPartial,
        appCode: this.options.appCode,
        surveys: this.options.surveys
      }));
      $("#participants-dropdown").html(this.participantsDropdownTpl({
        participants: this.collection
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
      var self = this;
      this.alertViews[options.alertType].on("cleared", function() {
        $(event.currentTarget).remove();
        self.alertViews[options.alertType].off();
      });
      $(options.target).modal("show");
    }
  });

  return GroupSummaryView;
});
