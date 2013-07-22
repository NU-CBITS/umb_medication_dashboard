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
      "click #help-yes": contactResearchStaff
    };

    function contactResearchStaff() {
      $.post(Resources[options.environment].urlRoot + options.appCode + "/contact_research_staff.json", function(data) {
      });
    }
  }

  return HelpModalPartial;
});
