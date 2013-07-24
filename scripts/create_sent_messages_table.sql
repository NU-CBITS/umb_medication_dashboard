CREATE TABLE sent_messages
(
  id text NOT NULL,
  "timestamp" double precision,
  "eventDateTime" timestamp without time zone,
  "insertedTime" timestamp without time zone,
  "GUID" text,
  "TIMESTAMP" bigint,
  "FEATURE_VALUE_DT_context" text,
  "FEATURE_VALUE_DT_date" text,
  CONSTRAINT sent_messages_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
