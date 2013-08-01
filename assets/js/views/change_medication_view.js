define([
  "backbone",
  "models/change_medication_request"
], function(Backbone, ChangeMedicationRequest) {
  var ChangeMedicationView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "_sendRequest");
      this.model = new ChangeMedicationRequest({}, {
        environment: options.environment,
        appCode: options.appCode,
        getUserId: options.getUserId
      });
      $(document).on("click", "#send-change-request", this._sendRequest);
    },

    _sendRequest: function() {
      var self = this;

      this.model.save({
        message: $("#change-request-message").val()
      })
      .done(function() {
        self.trigger("alert", "success", "Request sent.");
      })
      .fail(function() {
        self.trigger("alert", "danger", "Error sending request.");
      })
      .always(function() {
        $("#change-request-message").val("");
        $("#change-medication-modal").modal("hide");
      });
    }
  });

  return ChangeMedicationView;
});
