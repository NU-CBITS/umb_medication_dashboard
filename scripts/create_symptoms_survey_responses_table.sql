CREATE TABLE symptoms_survey_responses
(
  id text NOT NULL,
  "timestamp" double precision,
  "eventDateTime" timestamp without time zone,
  "insertedTime" timestamp without time zone,
  "FEATURE_VALUE_DT_surveyVersion" bigint,
  "FEATURE_VALUE_DT_timeStarted" text,
  "GUID" text,
  "TIMESTAMP" bigint,
  "FEATURE_VALUE_DT_index" text,
  "FEATURE_VALUE_DT_paranoia_frequency" text,
  "FEATURE_VALUE_DT_media_communication" text,
  "FEATURE_VALUE_DT_media_communication_frequency" text,
  "FEATURE_VALUE_DT_thought_insertion" text,
  "FEATURE_VALUE_DT_thought_insertion_frequency" text,
  "FEATURE_VALUE_DT_special_mission" text,
  "FEATURE_VALUE_DT_special_mission_frequency" text,
  "FEATURE_VALUE_DT_thought_broadcasting" text,
  "FEATURE_VALUE_DT_thought_broadcasting_frequency" text,
  "FEATURE_VALUE_DT_hallucinations" text,
  "FEATURE_VALUE_DT_hallucinations_frequency" text,
  "FEATURE_VALUE_DT_confused" text,
  "FEATURE_VALUE_DT_confused_frequency" text,
  "FEATURE_VALUE_DT_thought_disorders" text,
  "FEATURE_VALUE_DT_thought_disorders_frequency" text,
  "FEATURE_VALUE_DT_level_of_distress" text,
  "FEATURE_VALUE_DT_date" text,
  CONSTRAINT symptoms_survey_responses_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
