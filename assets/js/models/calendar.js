define(["backbone", "lib/date_formatter"], function(Backbone, DateFormatter) {
  var Calendar = function(date) {
    var self = this;

    this.referenceDate = date || Calendar.addDays(new Date(), 0);

    this.dates = function(format, options) {
      var days = (options || {}).days || Calendar.WEEK;
      var dates = _.map(_.range(-(days-1), 1), function(day) {
        return Calendar.addDays(self.referenceDate, day);
      });

      if (format === "iso8601") {
        dates = _.map(dates, function(d) { return DateFormatter.iso8601(d); });
      }

      return dates;
    };

    this.goToPreviousPeriod = function() {
      self.referenceDate = Calendar.addDays(self.referenceDate, -Calendar.WEEK);
      self.trigger("periodChanged");
    };

    this.goToNextPeriod = function() {
      if (!this.canGoToNextPeriod()) return;
      self.referenceDate = Calendar.addDays(self.referenceDate, Calendar.WEEK);
      self.trigger("periodChanged");
    };

    this.canGoToNextPeriod = function() {
      return self.referenceDate <= Calendar.addDays(new Date(), -2);
    };
  };
    
  Calendar.WEEK = 7;
  Calendar.MONTH = 28;

  Calendar.addDays = function(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
  };

  _.extend(Calendar.prototype, Backbone.Events);

  return Calendar;
});
