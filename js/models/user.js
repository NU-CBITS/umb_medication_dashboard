define(["backbone", "models/dose"], function(Backbone, Dose) {
  var User = Backbone.Model.extend({
    url: function() {
      return "mock_data/user_config_" + this.id + ".json.txt";
    },

    doses: function() {
      return _.map(this.get("doses"), function(dose) {
        return new Dose(dose);
      });
    },

    patientId: function() {
      return this._patient().id;
    },

    patientName: function() {
      return this._patient().name;
    },

    _patient: function() {
      return _.find(this.get("people"), { type: "patient" });
    }
  });

  return User;
});