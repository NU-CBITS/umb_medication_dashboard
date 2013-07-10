define([
  "backbone",
  "collections/participants",
  "text!templates/group_summary.tpl.html",
], function(Backbone, Participants, template) {
  var GroupSummaryView = Backbone.View.extend({
    initialize: function(options) {
      this.render();
    },

    template: _.template(template),

    render: function() {
      this.$el.html(this.template({
        participants: this.collection,
        nonadherenceDueToSideEffects: function() {}
      }));

      return this;
    }
  });

  return GroupSummaryView;
});