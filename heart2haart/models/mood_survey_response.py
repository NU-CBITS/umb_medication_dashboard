from django.db import models
from umb_dashboard.models import ParticipantModelManager

class MoodSurveyResponseManager(ParticipantModelManager):
  HIGH_FREQ = 'Almost all of the time'

  def negative_responses(self, participant_id, start_time):
    cursor = self.participant_db_cursor(participant_id)
    sql = self._select_negative_sql(cursor, start_time)

    return self.fetch_results(cursor, sql)

  def _select_negative_sql(self, cursor, start_time):
    columns = self.all_column_names(cursor)

    return 'SELECT %s FROM "%s" WHERE (%s);' % \
      (columns, self.model._meta.db_table, self._negative_conditions(cursor, start_time))

  def _negative_conditions(self, cursor, start_time):
    import re
    columns = self.raw_column_names(cursor)
    frequency_conditions = (
      '"%s"=\'%s\'' % (c, self.HIGH_FREQ)
      for c in columns
      if re.match('.*_frequency$', c)
    )

    return '"eventDateTime" >= \'%s\' AND (%s)' %  \
      (start_time, ' OR '.join(frequency_conditions) or False)

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
