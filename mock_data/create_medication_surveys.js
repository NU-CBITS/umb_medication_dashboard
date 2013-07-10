var F = require("./Faker"),
    _ = require("../js/vendor/lodash-1.3.1.min"),
    Cal = require("./calendar"),
    fs = require("fs");

var participantId = process.argv[2];
var CHANCE_DIDNT_TAKE = 0.3;
var CHANCE_DIDNT_RESPOND = 0.1;
var REASONS_FOR_MISSING = ["It doesn't help me.", "I don't need it.", "It's okay to skip it.", "I don't have it with me.", "It makes me feel bad."];

var date = new Date();
var dates = _.map(_.range(-40, 1), function(days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
});

var medTimes = ["09:00", "23:15"];

var surveys = [];

_.each(dates, function(d) {
  var fdate = Cal.iso8601(d);
  _.each(medTimes, function(t) {
    if (Math.random() > CHANCE_DIDNT_RESPOND) {
      var didTake = Math.random() > CHANCE_DIDNT_TAKE;
      var response = {
        feature_value_dt_index: didTake,
        feature_value_dt_date: fdate,
        feature_value_dt_dosetime: fdate + "T" + t + "Z"
      };
      if (!didTake) {
        response.feature_value_dt_reason_for_missing = pickOne(REASONS_FOR_MISSING);
      }
      surveys.push(response);
    }
  });
});

function pickOne(set) {
  var i = Math.round(Math.random() * set.length);

  return set[i];
}

//fs.writeFileSync("medication_survey_responses_" + participantId + ".json", JSON.stringify(surveys));

function writeSqlStatements() {
  _.each(surveys, function(survey) {
    fs.appendFileSync("insert_medication_survey_responses_" + participantId + ".sql",
                      "INSERT INTO medication_survey_responses VALUES ('" +
                      Math.round(Math.random() * 100000) +
                      "', 1373368559, '2013-07-09 11:15:59', '2013-07-09 11:15:59', 545537511, '2013-07-09T6:15Z', 'abcd', 1373368559, '" +
                      (survey.feature_value_dt_index ? "Yes" : "No") +
                      "', '" +
                      survey.feature_value_dt_date +
                      "', '" +
                      (survey.feature_value_dt_reason_for_missing || "").replace(/'/g, "''") +
                      "', '" +
                      survey.feature_value_dt_dosetime +
                      "');\n");
  });
}

writeSqlStatements();