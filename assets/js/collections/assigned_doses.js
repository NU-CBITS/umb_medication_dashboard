define([
  "../../config/resource_locations",
  "models/dose"
], function(Resources, Dose) {
   function AssignedDoses(options) {
    var self = this;

    this.environment = options.environment;
    this.appCode = options.appCode;
    this.user = options.user;
    this.values = [];

    this.fetch = function() {
      var req = $.getJSON(url())
      .done(function(doseHistory) {
        _.each(doseHistory, function(dosesAssignment) {
          self.values.push({
            startDate: isoDate(dosesAssignment.fields.eventDateTime),
            doses: doses(eval(dosesAssignment.fields.doses))
          });
        });
      });

      return req;
    };

    this.getValues = function() {
      return this.values;
    };

    this.getValuesOnDate = function(date) {
      var values = _.last(this.values, function(dosesAssignment) {
        return dosesAssignment.startDate <= date;
      });

      return values.length === 0 ? this.values[0] : values[values.length - 1];
    };

    function url() {
      return Resources[self.environment].urlRoot + self.appCode + "/participants/" + self.user.id + "/dose_history";
    }

    function isoDate(eventDateTime) {
      return eventDateTime.slice(0, 10);
    }

    function doses(dosesJson) {
      return _.map(JSON.parse(dosesJson), function(doseAttrs) {
        return new Dose(doseAttrs);
      });
    }
  }

  return AssignedDoses;
});

