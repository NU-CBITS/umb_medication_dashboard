define(["backbone", "lib/date_formatter"], function(Backbone, DateFormatter) {
  var Calendar = function(date) {
    var self = this,
        WEEK = 7;

    this.referenceDate = date || new Date();

    this.dates = function(format) {
      var dates = _.map(_.range(-(WEEK-1), 1), function(day) {
        return Calendar.addDays(self.referenceDate, day);
      });

      if (format === "iso8601") {
        dates = _.map(dates, function(d) { return DateFormatter.iso8601(d); });
      }

      return dates;
    };

    this.goToPreviousPeriod = function() {
      self.referenceDate = Calendar.addDays(self.referenceDate, -WEEK);
      self.trigger("periodChanged");
    };

    this.goToNextPeriod = function() {
      self.referenceDate = Calendar.addDays(self.referenceDate, WEEK);
      self.trigger("periodChanged");
    };
  };

  Calendar.addDays = function(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
  };

  _.extend(Calendar.prototype, Backbone.Events);

  return Calendar;
});