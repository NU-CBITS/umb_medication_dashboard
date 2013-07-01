define(["lodash"], function(_) {
  var Calendar = function(date) {
    this.referenceDate = date || new Date();
  };

  Calendar.addDays = function(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
  };

  Calendar.prototype.previousDays = function(days) {
    var self = this;

    return _.map(_.range(-(days-1), 1), function(day) {
      return Calendar.addDays(self.referenceDate, day);
    });
  };

  return Calendar;
});