define([
  "backbone",
  "collections/participants",
  "text!templates/group_summary.tpl.html",
], function(Backbone, Participants, template) {
  var GroupSummaryView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "render");
      this.collection = new Participants({ url: "mock_data/participants.json.txt" });
      this.collection.fetch({
        success: this.render
      });
    },

    template: _.template(template),

    render: function() {
      this.$el.html(this.template({
        participants: this.collection
      }));

      return this;
    }
  });

  return GroupSummaryView;
});