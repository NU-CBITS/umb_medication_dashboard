define(["lib/hash"], function(Hash) {
  var MED_PROMPT = {
    name: "medication",
    pages: {
      index: {
        question: "Did you take your <strong><%= formatter.twelveHourTime(dose.time) %></strong> dose of <strong><%= dose.medication %></strong>?",
        responses: [
          {
            label: "Yes",
            next_page: "pre_incentive",
            is_positive: true,
            completes_survey: true
          },
          {
            label: "No",
            next_page: "reason_for_missing",
            is_positive: false
          }
        ]
      },
      reason_for_missing: {
        question: "I am not taking this dose of <strong><%= dose.medication %></strong> because:",
        responses: [
          {
            label: "It doesn't help me.",
            next_page: "nonadherence",
            completes_survey: true
          },
          {
            label: "I don't need it.",
            next_page: "nonadherence",
            completes_survey: true
          },
          {
            label: "It's okay to skip it.",
            next_page: "nonadherence",
            completes_survey: true
          },
          {
            label: "I don't have it with me.",
            next_page: "nonadherence",
            completes_survey: true
          },
          {
            label: "The side effects make me feel bad.",
            next_page: "ask_to_notify",
            completes_survey: true
          }
        ]
      },
      ask_to_notify: {
        question: "You have indicated that you are not taking your <strong><%= dose.medication %></strong> because it makes you feel bad.<br />Would you like to let your psychiatrist know so you can discuss it at your next appointment?",
        responses: [
          {
            label: "Yes",
            next_page: "notify_counselor"
          },
          {
            label: "No",
            next_page: "offer_information"
          }
        ]
      },
      offer_information: {
        question: "Would you like to see some information on common side effects of Antipsychotic medications?",
        responses: [
          {
            label: "Yes, view information now",
            next_page: "side_effects"
          },
          {
            label: "No, not now",
            next_page: "pre_review"
          }
        ]
      }
    }
  };

  MED_PROMPT.versionHash = Hash.hashCode(JSON.stringify(MED_PROMPT.pages));

  return MED_PROMPT;
});
