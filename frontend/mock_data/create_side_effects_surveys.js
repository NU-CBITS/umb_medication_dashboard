var _ = require("../../js/vendor/lodash-1.3.1.min"),
    Cal = require("../calendar"),
    fs = require("fs");

var participantId = process.argv[2];
var CHANCE_DIDNT_RESPOND = 0.1;
var LEVELS_OF_DISTRESS = ["Not at all", "A little bit", "Somewhat", "Quite a bit", "Always"];

var date = new Date();
var dates = _.map(_.range(-40, 1), function(days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
});

var surveys = [];

_.each(dates, function(d) {
  if (Math.random() > CHANCE_DIDNT_RESPOND) {
    surveys.push({ fields: {
      feature_value_dt_index: pickOne(["No", "Yes"]),
      feature_value_dt_weight_concern_distress: (lastPick === "Yes" ? pickOne(LEVELS_OF_DISTRESS) : ""),
      feature_value_dt_sexual_problems: pickOne(["No", "Yes"]),
      feature_value_dt_sexual_problems_distress: (lastPick === "Yes" ? pickOne(LEVELS_OF_DISTRESS) : ""),
      feature_value_dt_insomnia: pickOne(["No", "Yes"]),
      feature_value_dt_insomnia_distress: (lastPick === "Yes" ? pickOne(LEVELS_OF_DISTRESS) : ""),
      feature_value_dt_restlessness: pickOne(["No", "Yes"]),
      feature_value_dt_restlessness_distress: (lastPick === "Yes" ? pickOne(LEVELS_OF_DISTRESS) : ""),
      feature_value_dt_low_energy: pickOne(["No", "Yes"]),
      feature_value_dt_low_energy_distress: (lastPick === "Yes" ? pickOne(LEVELS_OF_DISTRESS) : ""),
      feature_value_dt_not_like_self: pickOne(["No", "Yes"]),
      feature_value_dt_not_like_self_distress: (lastPick === "Yes" ? pickOne(LEVELS_OF_DISTRESS) : ""),
      feature_value_dt_excess_sedation: pickOne(["No", "Yes"]),
      feature_value_dt_excess_sedation_distress: (lastPick === "Yes" ? pickOne(LEVELS_OF_DISTRESS) : ""),
      feature_value_dt_poor_concentration: pickOne(["No", "Yes"]),
      feature_value_dt_poor_concentration_distress: (lastPick === "Yes" ? pickOne(LEVELS_OF_DISTRESS) : ""),
      feature_value_dt_trembling: pickOne(["No", "Yes"]),
      feature_value_dt_trembling_distress: (lastPick === "Yes" ? pickOne(LEVELS_OF_DISTRESS) : ""),
      feature_value_dt_date: Cal.iso8601(d)
    } });
  }
});

var lastPick;
function pickOne(set) {
  var i = Math.round(Math.random() * (set.length-1));

  return (lastPick = set[i]);
}

//fs.writeFileSync("side_effects_survey_responses_" + participantId + ".json.txt", JSON.stringify(surveys));

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

writeSqlStatements()
