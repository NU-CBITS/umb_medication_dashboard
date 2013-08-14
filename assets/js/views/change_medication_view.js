define([
  "backbone",
  "models/change_medication_request"
], function(Backbone, ChangeMedicationRequest) {
  var ChangeMedicationView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "_sendDiscontinueRequest", "_sendEditRequest", "_sendAddRequest");
      this.model = new ChangeMedicationRequest({}, {
        environment: options.environment,
        appCode: options.appCode,
        getUserId: options.getUserId
      });
      $(document).on("click", "#discontinue-medication", function() {
        $("#discontinue-medication-modal")
        .data("dose-description", $(this).data("dose-description"))
        .modal("show");

        return false;
      });
      $(document).on("click", "#send-discontinue-request", this._sendDiscontinueRequest);
      $(document).on("click", "#edit-medication", function() {
        $("#edit-medication-modal [name=dose-time]").val($(this).data("dose-time"));
        $("#edit-medication-modal [name=dose-medication]").val($(this).data("dose-medication"));
        $("#edit-medication-modal [name=dose-strength]").val($(this).data("dose-strength"));
        $("#edit-medication-modal [name=dose-dispensationUnit]").val($(this).data("doseDispensationunit"));
        $("#edit-medication-modal [name=dose-route]").val($(this).data("dose-route"));
        $("#edit-medication-modal")
        .data("dose-description", $(this).data("dose-description"))
        .modal("show");

        return false;
      });
      $(document).on("click", "#send-edit-request", this._sendEditRequest);
      $(document).on("click", "#add-medication", function() {
        $("#add-medication-modal").modal("show");

        return false;
      });
      $(document).on("click", "#send-add-request", this._sendAddRequest);
    },

    _sendDiscontinueRequest: function() {
      var self = this;

      this.model.save({
        message: "discontinue: " + $("#discontinue-medication-modal").data("dose-description")
      })
      .done(function() {
        self.trigger("alert", "success", "The researcher staff has been notified of the discontinuation of this medication.");
      })
      .fail(function() {
        self.trigger("alert", "danger", "Error sending request.");
      })
      .always(function() {
        $("#discontinue-medication-modal").modal("hide");
      });
    },

    _sendEditRequest: function() {
      var self = this,
          $m = $("#edit-medication-modal"),
          time = $m.find("[name=dose-time]").val(),
          medication = $m.find("[name=dose-medication]").val(),
          strength = $m.find("[name=dose-strength]").val(),
          dispensationUnit = $m.find("[name=dose-dispensationUnit]").val(),
          route = $m.find("[name=dose-route]").val();

      this.model.save({
        message: "change: '" + $m.data("dose-description") + "' to '" + medication + ", " + strength + " " + dispensationUnit + " " + route + " " + time + "'"
      })
      .done(function() {
        self.trigger("alert", "success", "The researcher staff has been notified for the medication change.");
      })
      .fail(function() {
        self.trigger("alert", "danger", "Error sending request.");
      })
      .always(function() {
        $("#edit-medication-modal").modal("hide");
      });
    },

    _sendAddRequest: function() {
      var self = this,
          $m = $("#add-medication-modal"),
          time = $m.find("[name=dose-time]").val(),
          medication = $m.find("[name=dose-medication]").val(),
          strength = $m.find("[name=dose-strength]").val(),
          dispensationUnit = $m.find("[name=dose-dispensationUnit]").val(),
          route = $m.find("[name=dose-route]").val();

      this.model.save({
        message: "add: " + medication + ", " + strength + " " + dispensationUnit + " " + route + " " + time
      })
      .done(function() {
        self.trigger("alert", "success", "The researcher staff has been notified for the medication addition.");
      })
      .fail(function() {
        self.trigger("alert", "danger", "Error sending request.");
      })
      .always(function() {
        $("#add-medication-modal").modal("hide");
      });
    }
  });

  return ChangeMedicationView;
});
