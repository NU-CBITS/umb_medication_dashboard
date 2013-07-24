var _ = require("../../js/vendor/lodash-1.3.1.min"),
    Cal = require("../calendar"),
    fs = require("fs");

var participantId = process.argv[2];
var CHANCE_DIDNT_RESPOND = 0.1;
var FREQUENCY = ["Only some of the time", "Almost all of the time"];

var date = new Date();
var dates = _.map(_.range(-40, 1), function(days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
});

var surveys = [];

_.each(dates, function(d) {
  if (Math.random() > CHANCE_DIDNT_RESPOND) {
    surveys.push({ fields: {
      feature_value_dt_index: pickOne(["No", "Yes"]),
      feature_value_dt_paranoia_frequency: (lastPick === "Yes" ? pickOne(FREQUENCY) : ""),
      feature_value_dt_media_communication: pickOne(["No", "Yes"]),
      feature_value_dt_media_communication_frequency: (lastPick === "Yes" ? pickOne(FREQUENCY) : ""),
      feature_value_dt_thought_insertion: pickOne(["No", "Yes"]),
      feature_value_dt_thought_insertion_frequency: (lastPick === "Yes" ? pickOne(FREQUENCY) : ""),
      feature_value_dt_special_mission: pickOne(["No", "Yes"]),
      feature_value_dt_special_mission_frequency: (lastPick === "Yes" ? pickOne(FREQUENCY) : ""),
      feature_value_dt_thought_broadcasting: pickOne(["No", "Yes"]),
      feature_value_dt_thought_broadcasting_frequency: (lastPick === "Yes" ? pickOne(FREQUENCY) : ""),
      feature_value_dt_hallucinations: pickOne(["No", "Yes"]),
      feature_value_dt_hallucinations_frequency: (lastPick === "Yes" ? pickOne(FREQUENCY) : ""),
      feature_value_dt_confused: pickOne(["No", "Yes"]),
      feature_value_dt_confused_frequency: (lastPick === "Yes" ? pickOne(FREQUENCY) : ""),
      feature_value_dt_thought_disorders: pickOne(["No", "Yes"]),
      feature_value_dt_thought_disorders_frequency: (lastPick === "Yes" ? pickOne(FREQUENCY) : ""),
      feature_value_dt_level_of_distress: pickOne(["Not at all", "A little bit", "Somewhat", "Quite a bit", "Always"]),
      feature_value_dt_date: Cal.iso8601(d)
    } });
  }
});

var lastPick;
function pickOne(set) {
  var i = Math.round(Math.random() * (set.length-1));

  return (lastPick = set[i]);
}

//fs.writeFileSync("symptoms_survey_responses_" + participantId + ".json.txt", JSON.stringify(surveys));

function writeSqlStatements() {
  _.each(surveys, function(survey) {
    fs.appendFileSync("insert_symptoms_survey_responses_" + participantId + ".sql",
                      "INSERT INTO symptoms_survey_responses VALUES ('" +
                      Math.round(Math.random() * 100000) +
                      "', 1373368559, '2013-07-09 11:15:59', '2013-07-09 11:15:59', 545537511, '2013-07-09T6:15Z', 'abcd', 1373368559," +
                      _.map(survey.fields, function(v, k) { return "'" + v + "'"; }).join(",") +
                      ");\n");
  });
}

writeSqlStatements()
