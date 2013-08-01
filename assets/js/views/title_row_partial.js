define([
  "backbone",
  "text!templates/partials/_title_row.tpl.html"
], function(Backbone, template) {
  var TitleRowPartial = Backbone.View.extend({
    template: _.template(template),

    render: function(pageTitle) {
      return this.template({ pageTitle: pageTitle });
    }
  });

  return new TitleRowPartial();
});
