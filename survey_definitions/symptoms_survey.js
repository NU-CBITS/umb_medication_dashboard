define(["lib/hash"], function(Hash) {
  var SYMPTOMS_SURVEY = {
    name: "symptoms",
    pages: {
      index: {
        question: "Over the last 24 hours, did you think you were being watched or talked about by others?",
        summary: "Paranoia",
        responses: [
          {
            label: "No",
            next_page: "media_communication",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "paranoia_frequency",
            is_positive: false
          }
        ]
      },
      paranoia_frequency: {
        question: "Did this happen...?",
        responses: [
          {
            label: "Only some of the time"
          },
          {
            label: "Almost all of the time"
          }
        ],
        next_page: "media_communication"
      },
      media_communication: {
        question: "Over the last 24 hours, did you think someone or something could communicate with you through the TV or through music?",
        summary: "Communication through TV / music",
        responses: [
          {
            label: "No",
            next_page: "thought_insertion",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "media_communication_frequency",
            is_positive: false
          }
        ]
      },
      media_communication_frequency: {
        question: "Did this happen...?",
        responses: [
          {
            label: "Only some of the time"
          },
          {
            label: "Almost all of the time"
          }
        ],
        next_page: "thought_insertion"
      },
      thought_insertion: {
        question: "Over the last 24 hours, did you think someone or something was putting thoughts in your head?",
        summary: "Thought insertion",
        responses: [
          {
            label: "No",
            next_page: "special_mission",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "thought_insertion_frequency",
            is_positive: false
          }
        ]
      },
      thought_insertion_frequency: {
        question: "Did this happen...?",
        responses: [
          {
            label: "Only some of the time"
          },
          {
            label: "Almost all of the time"
          }
        ],
        next_page: "special_mission"
      },
      special_mission: {
        question: "Over the last 24 hours, did you think you had a special mission or were chosen for a special purpose in life?",
        summary: "Special powers / mission",
        responses: [
          {
            label: "No",
            next_page: "thought_broadcasting",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "special_mission_frequency",
            is_positive: false
          }
        ]
      },
      special_mission_frequency: {
        question: "Did this happen...?",
        responses: [
          {
            label: "Only some of the time"
          },
          {
            label: "Almost all of the time"
          }
        ],
        next_page: "thought_broadcasting"
      },
      thought_broadcasting: {
        question: "Over the last 24 hours, did you think that people could read your thoughts or that you could read theirs?",
        summary: "Thought broadcasting",
        responses: [
          {
            label: "No",
            next_page: "hallucinations",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "thought_broadcasting_frequency",
            is_positive: false
          }
        ]
      },
      thought_broadcasting_frequency: {
        question: "Did this happen...?",
        responses: [
          {
            label: "Only some of the time"
          },
          {
            label: "Almost all of the time"
          }
        ],
        next_page: "hallucinations"
      },
      hallucinations: {
        question: "Over the last 24 hours, did you hear things (such as voices) or see things that other people could not hear or see?",
        summary: "Hallucinations",
        responses: [
          {
            label: "No",
            next_page: "confused",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "hallucinations_frequency",
            is_positive: false
          }
        ]
      },
      hallucinations_frequency: {
        question: "Did this happen...?",
        responses: [
          {
            label: "Only some of the time"
          },
          {
            label: "Almost all of the time"
          }
        ],
        next_page: "confused"
      },
      confused: {
        question: "Over the last 24 hours, was your thinking extremely confused or disorganized for no reason?",
        summary: "Disorganized / confused thinking",
        responses: [
          {
            label: "No",
            next_page: "thought_disorders",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "confused_frequency",
            is_positive: false
          }
        ]
      },
      confused_frequency: {
        question: "Did this happen...?",
        responses: [
          {
            label: "Only some of the time"
          },
          {
            label: "Almost all of the time"
          }
        ],
        next_page: "thought_disorders"
      },
      thought_disorders: {
        question: "Over the last 24 hours, did you have difficulty with your thoughts disappearing or your mind suddenly going blank?",
        summary: "Thought disorders",
        responses: [
          {
            label: "No",
            next_page: "pre_incentive",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "thought_disorders_frequency",
            is_positive: false
          }
        ]
      },
      thought_disorders_frequency: {
        question: "Did this happen...?",
        responses: [
          {
            label: "Only some of the time"
          },
          {
            label: "Almost all of the time"
          }
        ],
        next_page: "level_of_distress"
      },
      level_of_distress: {
        question: "Thinking about your answers to each of the previous questions, how much did these symptoms bother you?",
        responses: [
          {
            label: "Not at all",
            completes_survey: true
          },
          {
            label: "A little bit",
            completes_survey: true
          },
          {
            label: "Somewhat",
            completes_survey: true
          },
          {
            label: "Quite a bit",
            completes_survey: true
          },
          {
            label: "Always",
            next_page: "ask_to_notify",
            completes_survey: true
          }
        ],
        next_page: "offer_information"
      },
      ask_to_notify: {
        question: "Would you like to let your doctor know that you are always bothered by these symptoms so you can discuss it at your next appointment?",
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

  SYMPTOMS_SURVEY.versionHash = Hash.hashCode(JSON.stringify(SYMPTOMS_SURVEY.pages));

  return SYMPTOMS_SURVEY;
});
