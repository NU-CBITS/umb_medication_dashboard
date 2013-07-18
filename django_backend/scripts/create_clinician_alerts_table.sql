CREATE TABLE clinician_alerts
(
  id serial NOT NULL PRIMARY KEY,
  participant_id varchar(255) NOT NULL,
  type varchar(255) NOT NULL CHECK (type IN ('non_adherence', 'side_effects', 'symptoms')),
  created_at timestamp without time zone DEFAULT now(),
  is_cleared boolean NOT NULL DEFAULT FALSE,
  contacted_patient boolean NOT NULL DEFAULT FALSE,
  aware_of_issue boolean NOT NULL DEFAULT FALSE,
  will_discuss boolean NOT NULL DEFAULT FALSE
);
