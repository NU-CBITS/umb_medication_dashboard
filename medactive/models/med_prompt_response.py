import datetime
from django.db import models
from medactive.models.participant_model_manager import ParticipantModelManager

class MedPromptResponseManager(ParticipantModelManager):
  MAKES_ME_FEEL_BAD = 'The side effects make me feel bad.'

  def negative_responses(self, participant_id, start_time=datetime.datetime.min):
    cursor = self.participant_db_cursor(participant_id)
    sql = self._select_negative_sql(cursor, start_time)

    return self.fetch_results(cursor, sql)

  def _select_negative_sql(self, cursor, start_time):
    return 'SELECT %s FROM "%s" WHERE (%s);' % \
      (self.all_column_names(cursor), self.model._meta.db_table, self._negative_conditions(start_time))

  def _negative_conditions(self, start_time):
    return '"eventDateTime" >= \'%s\' AND "%sreason_for_missing" = \'%s\'' % \
      (start_time, self.PR_COLUMN_PREFIX, self.MAKES_ME_FEEL_BAD)

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
