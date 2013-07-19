define([
  "lodash",
  "text!templates/partials/_help_modal.tpl.html"
], function(_, helpModalTpl) {
  var partials = {
    helpModal: function() {
      return _.template(helpModalTpl, {});
    }
  };

  return partials;
});
