define(["lib/hash"], function(Hash) {
  var SIDE_EFFECTS_SURVEY = {
    name: "side_effects",
    pages: {
      index: {
        question: "In the past day, have you been experiencing side effects to your HIV medication?",
        summary: "Side effects",
        responses: [
          {
            label: "Yes",
            next_page: "frequency",
            is_positive: false
          },
          {
            label: "No",
            next_page: "incentive",
            is_positive: true,
            completes_survey: true
          }
        ]
      },
      frequency: {
        question: "How often did you experience the side effects in the past day?",
        summary: "Frequency",
        responses: [
          {
            label: "Some of the time",
            is_positive: false
          },
          {
            label: "Half of the time",
            is_positive: false
          },
          {
            label: "Most of the time",
            is_positive: false
          },
          {
            label: "All of the time",
            is_positive: false
          }
        ],
        next_page: "severity"
      },
      severity: {
        question: "How much did the side effects bother you?",
        summary: "Severity",
        responses: [
          {
            label: "Not at all",
            next_page: "incentive",
            is_positive: true,
            completes_survey: true
          },
          {
            label: "A little bit",
            next_page: "incentive",
            is_positive: false,
            completes_survey: true
          },
          {
            label: "Somewhat",
            next_page: "incentive",
            is_positive: false,
            completes_survey: true
          },
          {
            label: "Quite a bit",
            next_page: "incentive",
            is_positive: false,
            completes_survey: true
          },
          {
            label: "Always",
            next_page: "ask_to_notify",
            is_positive: false,
            completes_survey: true
          }
        ]
      },
      ask_to_notify: {
        question: "Would you like to let your adherence counselor know that you are always bothered by side effects so you can discuss it at your next appointment?",
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
        question: "Would you like to see some information on common side effects of HIV medications?",
        responses: [
          {
            label: "Yes, view information now",
            next_page: "information"
          },
          {
            label: "No, not now",
            next_page: "pre_incentive"
          }
        ]
      }
    }
  };

  SIDE_EFFECTS_SURVEY.versionHash = Hash.hashCode(JSON.stringify(SIDE_EFFECTS_SURVEY.pages));

  return SIDE_EFFECTS_SURVEY;
});
