CREATE TABLE "doseHistory"
(
  id text NOT NULL,
  "timestamp" double precision,
  "eventDateTime" timestamp without time zone,
  "insertedTime" timestamp without time zone,
  "GUID" text,
  "TIMESTAMP" double precision,
  doses text,
  CONSTRAINT "doseHistory_pk" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
