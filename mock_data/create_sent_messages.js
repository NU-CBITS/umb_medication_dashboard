var _ = require("../js/vendor/lodash-1.3.1.min"),
    Cal = require("./calendar"),
    fs = require("fs");

var participantId = process.argv[2];
var CHANCE_SENT_MESSAGE = 0.2;
var CONTEXTS = ["contact_page","medication","side_effects","symptoms"];

var date = new Date();
var dates = _.map(_.range(-40, 1), function(days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
});

var messages = [];

_.each(dates, function(d) {
  _.each(CONTEXTS, function(c) {
    if (Math.random() < CHANCE_SENT_MESSAGE) {
      messages.push({ fields: {
        feature_value_dt_context: c,
        feature_value_dt_date: Cal.iso8601(d)
      } });
    }
  });
});

function pickOne(set) {
  var i = Math.round(Math.random() * (set.length-1));

  return set[i];
}

fs.writeFileSync("medactive/participants/" + participantId + "/sent_messages.json", JSON.stringify(messages));

function writeSqlStatements() {
  _.each(surveys, function(survey) {
    fs.appendFileSync("insert_side_effects_survey_responses_" + participantId + ".sql",
                      "INSERT INTO side_effects_survey_responses VALUES ('" +
                      Math.round(Math.random() * 100000) +
                      "', 1373368559, '2013-07-09 11:15:59', '2013-07-09 11:15:59', 545537511, '2013-07-09T6:15Z', 'abcd', 1373368559," +
                      _.map(survey.fields, function(v, k) { return "'" + v + "'"; }).join(",") +
                      ");\n");
  });
}

//writeSqlStatements()
