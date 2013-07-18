define([
  "backbone"
], function(Backbone) {
  var Router = Backbone.Router.extend({
    routes: {
      "weekly_summaries/:participant_id": "participantWeeklySummary",
      "*path": "index"
    }
  });

  return new Router();
});