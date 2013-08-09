from django.db import models
from umb_dashboard.models import ParticipantModelManager

class MoodSurveyResponseManager(ParticipantModelManager):
  NO_PROBLEMS = 'Not at all'

  def negative_responses(self, participant_id, start_time):
    cursor = self.participant_db_cursor(participant_id)
    sql = self._select_negative_sql(cursor, start_time)

    return self.fetch_results(cursor, sql)

  def _select_negative_sql(self, cursor, start_time):
    columns = self.all_column_names(cursor)

    return 'SELECT %s FROM "%s" WHERE (%s);' % \
      (columns, self.model._meta.db_table, self._negative_conditions(cursor, start_time))

  def _negative_conditions(self, cursor, start_time):
    return '"eventDateTime" >= \'%s\' AND ("FEATURE_VALUE_DT_index" <> \'%s\' OR "FEATURE_VALUE_DT_frequency" <> \'%s\')' %  \
      (start_time, self.NO_PROBLEMS, self.NO_PROBLEMS)

class MoodSurveyResponse(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  surveyVersion = models.BigIntegerField()
  timeStarted = models.TextField()
  index = models.TextField()
  frequency = models.TextField()
  date = models.TextField()

  objects = MoodSurveyResponseManager()

  class Meta:
    db_table = 'mood_survey_responses'
    managed = False
