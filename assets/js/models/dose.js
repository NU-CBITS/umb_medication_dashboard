define(["lib/date_formatter"], function(DateFormatter) {
  function Dose(attrs) {
    var time = attrs.time;

    this.medication = attrs.medication;
    this.strength = attrs.strength;
    this.dispensationUnit = attrs.dispensationUnit;

    this.summary = function() {
      return this.medication + ", " + this.strength + " " + this.dispensationUnit;
    }

    this.time = function() {
      return DateFormatter.timeStringToMeridian(time);
    }
  }

  return Dose;
});
