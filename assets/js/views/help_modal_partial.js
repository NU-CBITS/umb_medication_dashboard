define([
  "lodash",
  "../../config/resource_locations",
  "text!templates/partials/_help_modal.tpl.html"
], function(_, Resources, helpModalTpl) {
  function HelpModalPartial(options) {
    this.render = function() {
      return _.template(helpModalTpl, {});
    };

    this.events = {
      "click #help-yes": contactResearchStaff,
      "click #help-cancel": hideModal
    };

    function url() {
      return Resources[options.environment].urlRoot + options.appCode + "/contact_research_staff";
    }

    function contactResearchStaff() {
      var self = this;

      $.post(url())
      .done(function(data) {
        self.trigger("alert", "success", "Thank you, your message has been sent. You will be contacted within 1 business day.");
      })
      .error(function(data) {
        self.trigger("alert", "danger", "Error sending message.");
      });
      hideModal();
    }

    function hideModal() {
      $("#help-modal").modal("hide");
    }
  }

  return HelpModalPartial;
});
