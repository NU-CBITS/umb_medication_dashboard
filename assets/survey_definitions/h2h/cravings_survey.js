define(["lib/hash"], function(Hash) {
  var CRAVINGS_SURVEY = {
    name: "cravings",
    pages: {
      index: {
        question: "Over the past day, have you been experiencing cravings to use alcohol or street drugs?",
        summary: "Alcohol / drug cravings",
        responses: [
          {
            label: "Yes",
            next_page: "support_groups",
            is_positive: false,
            completes_survey: true
          },
          {
            label: "No",
            next_page: "incentive",
            is_positive: true,
            completes_survey: true
          }
        ]
      },
      support_groups: {
        question: "Would you like to see information on support group meetings near you?",
        responses: [
          {
            label: "Alcoholics Anonymous",
            next_page: "alcoholics_anonymous_locations"
          },
          {
            label: "Narcotics Anonymous",
            next_page: "narcotics_anonymous_locations"
          },
          {
            label: "No",
            next_page: "see_cravings"
          }
        ]
      },
      see_cravings: {
        question: "Would you like to see information on how to manage your cravings?",
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

  CRAVINGS_SURVEY.versionHash = Hash.hashCode(JSON.stringify(CRAVINGS_SURVEY.pages));

  return CRAVINGS_SURVEY;
});
