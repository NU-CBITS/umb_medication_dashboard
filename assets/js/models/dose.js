define(["lib/date_formatter"], function(DateFormatter) {
  function Dose(attrs) {
    this.medication = attrs.medication;
    this.strength = attrs.strength;
    this.dispensationUnit = attrs.dispensationUnit;
    this.rawTime = attrs.time;

    this.summary = function() {
      return this.medication + ", " + this.strength + " " + this.dispensationUnit;
    }

    this.time = function() {
      return DateFormatter.timeStringToMeridian(this.rawTime);
    }
  }

  return Dose;
});
