from django.conf import settings
from django.db import models
import psycopg2

class MedPromptResponseManager(models.Manager):
  def for_participant(self, participant_id):
    db_string = "host='%(HOST)' dbname='" + db_name(participant_id) + "' user='%(USER)' password='%(PASSWORD)'" % \
      settings.PARTICIPANT_DB
    connection = psycopg2.connect(db_string)
    cursor = connection.cursor()
    cursor.execute("""
      SELECT "id",
             "eventDateTime",
             "FEATURE_VALUE_DT_surveyVersion" AS "surveyVersion",
             "FEATURE_VALUE_DT_timeStarted" AS "timeStarted",
             "FEATURE_VALUE_DT_index" AS "index",
             "FEATURE_VALUE_DT_date" AS "date",
             "FEATURE_VALUE_DT_reason_for_missing" AS "reason_for_missing",
             "FEATURE_VALUE_DT_doseTime" AS "doseTime",
      FROM "' + model._meta.db_table + '";""")
    result_list = []
    for row in cursor.fetchall():
      m = self.model(id=row[0], eventDateTime=row[1], surveyVersion=row[2],
        timeStarted=row[3], index=row[4], date=row[5],
        reason_for_missing=row[6], doseTime=row[7])
      result_list.append(p)

    return result_list

  def _db_name(self, participant_id):
    return 'umb_' + participant_id

class MedPromptResponse(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  surveyVersion = models.BigIntegerField()
  timeStarted = models.TextField()
  index = models.TextField()
  date = models.TextField()
  reason_for_missing = models.TextField()
  doseTime = models.TextField()

  objects = MedPromptResponseManager()

  class Meta:
    db_table = 'medication_survey_responses'
    managed = False
