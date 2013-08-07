define(["lib/hash"], function(Hash) {
  var MOOD_SURVEY = {
    name: "mood",
    pages: {
      index: {
        question: "Over the past week, how often have you been bothered by having little interest or pleasure in doing things?",
        summary: "Little interest / pleasure",
        responses: [
          {
            label: "Not at all",
            is_positive: true
          },
          {
            label: "Several days",
            is_positive: false
          },
          {
            label: "More than half the days",
            is_positive: false
          },
          {
            label: "Nearly every day",
            is_positive: false
          },
          {
            label: "Every day",
            is_positive: false
          }
        ],
        next_page: "frequency"
      },
      frequency: {
        question: "Over the past week, how often have you been bothered by feeling down, depressed or hopeless?",
        summary: "Down / depressed / hopeless",
        responses: [
          {
            label: "Not at all",
            next_page: "incentive",
            is_positive: true,
            completes_survey: true
          },
          {
            label: "Several days",
            next_page: "incentive",
            is_positive: false,
            completes_survey: true
          },
          {
            label: "More than half the days",
            next_page: "incentive",
            is_positive: false,
            completes_survey: true
          },
          {
            label: "Nearly every day",
            next_page: "incentive",
            is_positive: false,
            completes_survey: true
          },
          {
            label: "Every day",
            next_page: "ask_to_notify",
            is_positive: false,
            completes_survey: true
          }
        ]
      },
      ask_to_notify: {
        question: "Would you like to let your adherence counselor know that you are bothered by these symptoms so you can discuss it at your next appointment?",
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
        question: "Would you like to see some information on depression?",
        responses: [
          {
            label: "No, not now",
            next_page: "pre_incentive"
          },
          {
            label: "Yes, view information now",
            next_page: "information"
          }
        ]
      }
    }
  };

  return MOOD_SURVEY;
});
