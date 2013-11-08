define(["lib/hash"], function(Hash) {
  var SYMPTOMS_SURVEY = {
    name: "symptoms",
    pages: {
      index: {
        question: "Over the last 24 hours, did you hear things (such as voices) or see things that other people could not hear or see?",
        summary: "Voices or visions",
        responses: [
          {
            label: "No",
            next_page: "confused_thinking",
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
        next_page: "confused_thinking"
      },
      confused_thinking: {
        question: "Over the last 24 hours, <%= Math.random() > 0.5 ? 'was your thinking extemely confused or disorganized for some reason' : 'did you have difficulty with your thoughts disappearing or your mind suddenly going blank' %>?",
        summary: "Confused thinking",
        responses: [
          {
            label: "No",
            next_page: "paranoia",
            is_positive: true
          },
          {
            label: "Yes",
            next_page: "confused_thinking_frequency",
            is_positive: false
          }
        ]
      },
      confused_thinking_frequency: {
        question: "Did this happen...?",
        responses: [
          {
            label: "Only some of the time"
          },
          {
            label: "Almost all of the time"
          }
        ],
        next_page: "paranoia"
      },
      paranoia: {
        question: "Over the last 24 hours, <%= Math.random() > 0.5 ? 'did you think you were being watched or talked about by others' : 'did you think people were out to get you or to cause you harm' %>?",
        summary: "Paranoia",
        responses: [
          {
            label: "No",
            next_page: "special_mission",
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
        next_page: "special_mission"
      },
      special_mission: {
        question: "Over the last 24 hours, <%= Math.random() > 0.5 ? 'did you think that you had special powers to do something nobody else could do' : 'did you think you had a special mission or were chosen for a special purpose in life' %>?",
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
        question: "Over the last 24 hours, <%= Math.random() > 0.5 ? 'did you think that people could read your thoughts or that you could read theirs' : 'did you feel your thoughts left your mind and that everyone around you knew what you were thinking' %>?",
        summary: "Thought broadcasting",
        responses: [
          {
            label: "No",
            next_page: "thought_insertion",
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
        next_page: "thought_insertion"
      },
      thought_insertion: {
        question: "Did you think someone or something was putting thoughts in your head?",
        summary: "Thought insertion",
        responses: [
          {
            label: "No",
            next_page: "media_communication",
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
        next_page: "media_communication"
      },
      media_communication: {
        question: "Over the last 24 hours, <%= Math.random() > 0.5 ? 'did you think someone or something could communicate with you through the TV or through music' : 'did you think someone on TV was making comments about you or your family' %>?",
        summary: "TV or music communicating",
        responses: [
          {
            label: "No",
            next_page: {
              any: [
                { index: "Yes" },
                { confused_thinking: "Yes" },
                { paranoia: "Yes" },
                { special_mission: "Yes" },
                { thought_broadcasting: "Yes" },
                { thought_insertion: "Yes" }
              ],
              then: "level_of_distress",
              else: "pre_incentive"
            },
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
        question: "Would you like to see some information on common symptoms of schizophrenia?",
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
