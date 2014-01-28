from django.db import models
from .participant_model_manager import ParticipantModelManager

class MedPromptResponseManager(ParticipantModelManager):
  MAKES_ME_FEEL_BAD = 'The side effects make me feel bad.'

  def negative_responses(self, participant_id, start_time):
    cursor = self.participant_db_cursor(participant_id)
    sql = self._select_negative_sql(cursor, start_time)

    return self.fetch_results(cursor, sql)

  def latest_value_is_negative(self, participant_id):
    cursor = self.participant_db_cursor(participant_id)
    sql = self._select_latest_if_negative_sql(cursor)

    return len(self.fetch_results(cursor, sql)) >= 1

  def _select_negative_sql(self, cursor, start_time):
    return 'SELECT %s FROM "%s" WHERE (%s);' % \
      (self.all_column_names(cursor), self.model._meta.db_table, self._negative_conditions(start_time))

  def _negative_conditions(self, start_time):
    return '"eventDateTime" >= \'%s\' AND "%sreason_for_missing" = \'%s\'' % \
      (start_time, self.PR_COLUMN_PREFIX, self.MAKES_ME_FEEL_BAD)

  def _select_latest_if_negative_sql(self, cursor):
    return 'WITH last_response AS (SELECT %s FROM "%s" ORDER BY "eventDateTime" DESC LIMIT(1)) SELECT * FROM last_response WHERE "reason_for_missing" = \'%s\'' % \
      (self.all_column_names(cursor), self.model._meta.db_table, self.MAKES_ME_FEEL_BAD)

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
