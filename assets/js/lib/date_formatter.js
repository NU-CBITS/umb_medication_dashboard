define(function() {
  var DateFormatter = {
    iso8601: function(date) {
      return date.getFullYear() + "-" + padLeft2(date.getMonth() + 1, "0") +
        "-" + padLeft2(date.getDate(), "0");
    },

    monthSlashDate: function(date) {
      return (date.getMonth() + 1) + "/" + date.getDate();
    },

    // convert either HH:MM or YYYY-MM-DDTHH:MM:SSZ to HH:MM[AM|PM]
    timeStringToMeridian: function(timeStr) {
      if (!timeStr) return "";
      var date, hours, minutes, ampm;

      date = Date.parse(timeStr);
      if (isNaN(date)) {
        hours = timeStr.match(/[^:\d]?(\d+):/)[1];
        minutes = timeStr.match(/:(\d+)[^\d]/)[1];
        hours = parseInt(hours, 10);
      } else {
        date = new Date(date);
        hours = date.getHours();
        minutes = date.getMinutes();
      }
      ampm = hours > 11 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours === 0 ? 12 : hours;

      return hours + ":" + padLeft2(minutes, "0") + ampm;
    },

    dateTimeString: function(timeStampStr) {
      if (timeStampStr === null || typeof timeStampStr === 'undefined') {
        return '';
      } else {
        return DateFormatter.monthSlashDate(new Date(timeStampStr)) + " " + DateFormatter.timeStringToMeridian(timeStampStr);
      }
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
