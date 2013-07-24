CREATE TABLE side_effects_survey_responses
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
  "FEATURE_VALUE_DT_weight_concern_distress" text,
  "FEATURE_VALUE_DT_sexual_problems" text,
  "FEATURE_VALUE_DT_sexual_problems_distress" text,
  "FEATURE_VALUE_DT_insomnia" text,
  "FEATURE_VALUE_DT_insomnia_distress" text,
  "FEATURE_VALUE_DT_restlessness" text,
  "FEATURE_VALUE_DT_restlessness_distress" text,
  "FEATURE_VALUE_DT_low_energy" text,
  "FEATURE_VALUE_DT_low_energy_distress" text,
  "FEATURE_VALUE_DT_not_like_self" text,
  "FEATURE_VALUE_DT_not_like_self_distress" text,
  "FEATURE_VALUE_DT_excess_sedation" text,
  "FEATURE_VALUE_DT_excess_sedation_distress" text,
  "FEATURE_VALUE_DT_poor_concentration" text,
  "FEATURE_VALUE_DT_poor_concentration_distress" text,
  "FEATURE_VALUE_DT_trembling" text,
  "FEATURE_VALUE_DT_trembling_distress" text,
  "FEATURE_VALUE_DT_date" text,
  CONSTRAINT side_effects_survey_responses_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
