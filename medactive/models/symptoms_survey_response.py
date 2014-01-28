import datetime
from django.db import models
from umb_dashboard.models import ParticipantModelManager

class SymptomsSurveyResponseManager(ParticipantModelManager):
  HIGH_FREQ = 'Almost all of the time'

  def negative_responses(self, participant_id, start_time):
    cursor = self.participant_db_cursor(participant_id)
    sql = self._select_negative_sql(cursor, start_time)

    return self.fetch_results(cursor, sql)

  def latest_value_is_negative(self, participant_id):
    cursor = self.participant_db_cursor(participant_id)
    sql = self._select_latest_if_negative_sql(cursor)

    return len(self.fetch_raw_results(cursor, sql)) >= 1

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

  def _select_latest_if_negative_sql(self, cursor):
    return 'WITH last_response AS (SELECT "%s" FROM "%s" ORDER BY "eventDateTime" DESC LIMIT(1)) SELECT * FROM last_response WHERE (%s);' % \
      ('", "'.join(self.raw_column_names(cursor)), self.model._meta.db_table, self._negative_conditions_simple_column_names_no_time(cursor))

  def _negative_conditions_simple_column_names_no_time(self, cursor):
    import re
    columns = self.raw_column_names(cursor)
    distress_conditions = (
      '"%s"=\'%s\'' % (c, self.HIGH_FREQ)
      for c in columns
      if re.match('.*_frequency$', c)
    )

    return '(%s)' %  (' OR '.join(distress_conditions) or False)

class SymptomsSurveyResponse(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  surveyVersion = models.BigIntegerField()
  timeStarted = models.TextField()
  index = models.TextField()
  hallucinations = models.TextField()
  hallucinations_frequency = models.TextField()
  paranoia = models.TextField()
  paranoia_frequency = models.TextField()
  media_communication = models.TextField()
  media_communication_frequency = models.TextField()
  thought_insertion = models.TextField()
  thought_insertion_frequency = models.TextField()
  special_mission = models.TextField()
  special_mission_frequency = models.TextField()
  thought_broadcasting = models.TextField()
  thought_broadcasting_frequency = models.TextField()
  confused = models.TextField()
  confused_frequency = models.TextField()
  confused_thinking = models.TextField()
  confused_thinking_frequency = models.TextField()
  thought_disorders = models.TextField()
  thought_disorders_frequency = models.TextField()
  level_of_distress = models.TextField()
  date = models.TextField()

  objects = SymptomsSurveyResponseManager()

  class Meta:
    db_table = 'symptoms_survey_responses'
    managed = False
