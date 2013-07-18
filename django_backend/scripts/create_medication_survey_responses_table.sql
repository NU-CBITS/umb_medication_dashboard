CREATE TABLE medication_survey_responses
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
  "FEATURE_VALUE_DT_date" text,
  "FEATURE_VALUE_DT_reason_for_missing" text,
  "FEATURE_VALUE_DT_doseTime" text,
  CONSTRAINT medication_survey_responses_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
