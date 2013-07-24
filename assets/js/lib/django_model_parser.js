define([
  "lodash"
], function(_) {
  function djangoModelParser(data, options) {
    var parsed = { id: data.pk };

    _.each(data.fields, function(v, k) {
      parsed[k] = v;
    });

    return parsed;
  }

  return djangoModelParser;
});
