define(["lib/hash"], function(Hash) {
  var SIDE_EFFECTS_SURVEY = {
    name: "side_effects",
    pages: {
      index: {
        question: "Over the last 24 hours, have you been concerned about your weight?",
        summary: "Concerns about weight",
        responses: [
          {
            label: "No",
            next_page: "sexual_problems",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "weight_concern_distress",
            is_positive: false
          }
        ]
      },
      weight_concern_distress: {
        question: "How much did this bother you?",
        responses: [
          {
            label: "Not at all",
            is_positive: true
          },
          {
            label: "A little bit",
            is_positive: false
          },
          {
            label: "Somewhat",
            is_positive: false
          },
          {
            label: "Quite a bit",
            is_positive: false
          },
          {
            label: "Always",
            is_positive: false
          }
        ],
        next_page: "sexual_problems"
      },
      sexual_problems: {
        question: "Over the last 24 hours, did you have sexual problems or difficulties?",
        summary: "Sexual problems",
        responses: [
          {
            label: "No",
            next_page: "insomnia",
            is_positive: false
          },
          {
            label: "Yes",
            next_page: "sexual_problems_distress",
            is_positive: false
          }
        ]
      },
      sexual_problems_distress: {
        question: "How much did this bother you?",
        responses: [
          {
            label: "Not at all",
            is_positive: true
          },
          {
            label: "A little bit",
            is_positive: false
          },
          {
            label: "Somewhat",
            is_positive: false
          },
          {
            label: "Quite a bit",
            is_positive: false
          },
          {
            label: "Always",
            is_positive: false
          }
        ],
        next_page: "insomnia"
      },
      insomnia: {
        question: "Over the last 24 hours, did you have problems getting to sleep or staying asleep?",
        summary: "Insomnia",
        responses: [
          {
            label: "No",
            next_page: "restlessness",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "insomnia_distress",
            is_positive: false
          }
        ]
      },
      insomnia_distress: {
        question: "How much did this bother you?",
        responses: [
          {
            label: "Not at all",
            is_positive: true
          },
          {
            label: "A little bit",
            is_positive: false
          },
          {
            label: "Somewhat",
            is_positive: false
          },
          {
            label: "Quite a bit",
            is_positive: false
          },
          {
            label: "Always",
            is_positive: false
          }
        ],
        next_page: "restlessness"
      },
      restlessness: {
        question: "Over the last 24 hours, did you feel jittery, restless or like you couldn't sit still?",
        summary: "Restlessness",
        responses: [
          {
            label: "No",
            next_page: "low_energy",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "restlessness_distress",
            is_positive: false
          }
        ]
      },
      restlessness_distress: {
        question: "How much did this bother you?",
        responses: [
          {
            label: "Not at all",
            is_positive: true
          },
          {
            label: "A little bit",
            is_positive: false
          },
          {
            label: "Somewhat",
            is_positive: false
          },
          {
            label: "Quite a bit",
            is_positive: false
          },
          {
            label: "Always",
            is_positive: false
          }
        ],
        next_page: "low_energy"
      },
      low_energy: {
        question: "Over the last 24 hours, did you feel slowed down or like you didn't have any energy?",
        summary: "Low energy",
        responses: [
          {
            label: "No",
            next_page: "not_like_self",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "low_energy_distress",
            is_positive: false
          }
        ]
      },
      low_energy_distress: {
        question: "How much did this bother you?",
        responses: [
          {
            label: "Not at all",
            is_positive: true
          },
          {
            label: "A little bit",
            is_positive: false
          },
          {
            label: "Somewhat",
            is_positive: false
          },
          {
            label: "Quite a bit",
            is_positive: false
          },
          {
            label: "Always",
            is_positive: false
          }
        ],
        next_page: "not_like_self"
      },
      not_like_self: {
        question: "Over the last 24 hours, did you not feel like yourself?",
        summary: "Not feeling like oneself",
        responses: [
          {
            label: "No",
            next_page: "excess_sedation",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "not_like_self_distress",
            is_positive: false
          }
        ]
      },
      not_like_self_distress: {
        question: "How much did this bother you?",
        responses: [
          {
            label: "Not at all",
            is_positive: true
          },
          {
            label: "A little bit",
            is_positive: false
          },
          {
            label: "Somewhat",
            is_positive: false
          },
          {
            label: "Quite a bit",
            is_positive: false
          },
          {
            label: "Always",
            is_positive: false
          }
        ],
        next_page: "excess_sedation"
      },
      excess_sedation: {
        question: "Over the last 24 hours, did you sleep too much or feel too tired during the day?",
        summary: "Excess sedation",
        responses: [
          {
            label: "No",
            next_page: "poor_concentration",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "excess_sedation_distress",
            is_positive: false
          }
        ]
      },
      excess_sedation_distress: {
        question: "How much did this bother you?",
        responses: [
          {
            label: "Not at all",
            is_positive: true
          },
          {
            label: "A little bit",
            is_positive: false
          },
          {
            label: "Somewhat",
            is_positive: false
          },
          {
            label: "Quite a bit",
            is_positive: false
          },
          {
            label: "Always",
            is_positive: false
          }
        ],
        next_page: "poor_concentration"
      },
      poor_concentration: {
        question: "Over the last 24 hours, did you have difficulty concentrating or remembering things?",
        summary: "Concentration difficulties",
        responses: [
          {
            label: "No",
            next_page: "trembling",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "poor_concentration_distress",
            is_positive: false
          }
        ]
      },
      poor_concentration_distress: {
        question: "How much did this bother you?",
        responses: [
          {
            label: "Not at all",
            is_positive: true
          },
          {
            label: "A little bit",
            is_positive: false
          },
          {
            label: "Somewhat",
            is_positive: false
          },
          {
            label: "Quite a bit",
            is_positive: false
          },
          {
            label: "Always",
            is_positive: false
          }
        ],
        next_page: "trembling"
      },
      trembling: {
        question: "Over the last 24 hours, did your muscles tremble, shake, or feel stiff?",
        summary: "Muscle stiffness / trembling",
        responses: [
          {
            label: "No",
            completes_survey: true,
            next_page: {
              any: [
                { weight_concern_distress: "Always" },
                { sexual_problems_distress: "Always" },
                { insomnia_distress: "Always" },
                { restlessness_distress: "Always" },
                { low_energy_distress: "Always" },
                { not_like_self_distress: "Always" },
                { excess_sedation_distress: "Always" },
                { poor_concentration_distress: "Always" }
              ],
              then: "ask_to_notify",
              else: "pre_incentive"
            }
          },
          {
            label: "Yes",
            next_page: "trembling_distress"
          }
        ]
      },
      trembling_distress: {
        question: "How much did this bother you?",
        responses: [
          {
            label: "Not at all",
            is_positive: true,
            completes_survey: true
          },
          {
            label: "A little bit",
            is_positive: false,
            completes_survey: true
          },
          {
            label: "Somewhat",
            is_positive: false,
            completes_survey: true
          },
          {
            label: "Quite a bit",
            is_positive: false,
            completes_survey: true
          },
          {
            label: "Always",
            is_positive: false,
            completes_survey: true
          }
        ],
        next_page: {
          any: [
            { weight_concern_distress: "Always" },
            { sexual_problems_distress: "Always" },
            { insomnia_distress: "Always" },
            { restlessness_distress: "Always" },
            { low_energy_distress: "Always" },
            { not_like_self_distress: "Always" },
            { excess_sedation_distress: "Always" },
            { poor_concentration_distress: "Always" },
            { trembling_distress: "Always" }
          ],
          then: "ask_to_notify",
          else: "offer_information"
        }
      },
      offer_information: {
        question: "Would you like to see some information on common side effects of antipsychotic medications?",
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
      },
      ask_to_notify: {
        question: "Would you like to let your doctor know that you are always bothered by some side effects so you can discuss it at your next appointment?",
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
      }
    }
  };

  SIDE_EFFECTS_SURVEY.versionHash = Hash.hashCode(JSON.stringify(SIDE_EFFECTS_SURVEY.pages));

  return SIDE_EFFECTS_SURVEY;
});
