// http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
define(function() {
  var Hash = {
    hashCode: function(str) {
      var hash = 0, i, char;
      if (str.length === 0) return hash;
      for (i = 0, l = str.length; i < l; i++) {
        char  = str.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }
  };

  return Hash;
});