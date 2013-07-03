define(function() {
  var DateFormatter = {
    iso8601: function(date) {
      return date.getFullYear() + "-" + padLeft2(date.getMonth() + 1, "0") +
        "-" + padLeft2(date.getDate(), "0");
    },

    monthSlashDate: function(date) {
      return (date.getMonth() + 1) + "/" + date.getDate();
    },

    timeStringToMeridian: function(timeStr) {
      var hours, minutes, ampm;

      hours = timeStr.match(/\d+/)[0];
      minutes = timeStr.match(/:(\d+):/)[1];
      hours = parseInt(hours, 10);
      ampm = hours > 11 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours === 0 ? 12 : hours;

      return hours + ":" + minutes + ampm;
    }
  };

  function padLeft2(value, padStr) {
    var padded = "" + value;

    switch(padded.length)
    {
      case 0:
        return padStr + padStr + padded;
      case 1:
        return padStr + padded;
      default:
        return padded;
    }
  }

  return DateFormatter;
});