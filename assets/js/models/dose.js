define(["lib/date_formatter"], function(DateFormatter) {
  function Dose(attrs) {
    var medication, strength, dispensationUnit, time;

    medication = attrs.medication;
    strength = attrs.strength;
    dispensationUnit = attrs.dispensationUnit;
    time = attrs.time;

    this.summary = function() {
      return medication + ", " + strength + " " + dispensationUnit;
    }

    this.time = function() {
      return DateFormatter.timeStringToMeridian(time);
    }
  }

  return Dose;
});