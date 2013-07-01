define(function() {
  var DateFormatter = {
    iso8601: function(date) {
      return date.getFullYear() + "-" + padLeft2(date.getMonth() + 1, "0") +
        "-" + padLeft2(date.getDate(), "0");
    },

    monthSlashDate: function(date) {
      return (date.getMonth() + 1) + "/" + date.getDate();
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