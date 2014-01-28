import datetime
from django.db import models
from umb_dashboard.models import ParticipantModelManager

class SideEffectsSurveyResponseManager(ParticipantModelManager):
  HIGH_FREQ = 'Always'

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
    distress_conditions = (
      '"%s"=\'%s\'' % (c, self.HIGH_FREQ)
      for c in columns
      if re.match('.*_distress$', c)
    )

    return '"eventDateTime" >= \'%s\' AND (%s)' %  \
      (start_time, ' OR '.join(distress_conditions) or False)

  def _select_latest_if_negative_sql(self, cursor):
    return 'WITH last_response AS (SELECT "%s" FROM "%s" ORDER BY "eventDateTime" DESC LIMIT(1)) SELECT * FROM last_response WHERE (%s);' % \
      ('", "'.join(self.raw_column_names(cursor)), self.model._meta.db_table, self._negative_conditions_simple_column_names_no_time(cursor))

  def _negative_conditions_simple_column_names_no_time(self, cursor):
    import re
    columns = self.raw_column_names(cursor)
    distress_conditions = (
      '"%s"=\'%s\'' % (c, self.HIGH_FREQ)
      for c in columns
      if re.match('.*_distress$', c)
    )

    return '(%s)' %  (' OR '.join(distress_conditions) or False)

class SideEffectsSurveyResponse(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  surveyVersion = models.BigIntegerField()
  timeStarted = models.TextField()
  index = models.TextField()
  weight_concern_distress = models.TextField()
  sexual_problems = models.TextField()
  sexual_problems_distress = models.TextField()
  insomnia = models.TextField()
  insomnia_distress = models.TextField()
  restlessness = models.TextField()
  restlessness_distress = models.TextField()
  low_energy = models.TextField()
  low_energy_distress = models.TextField()
  not_like_self = models.TextField()
  not_like_self_distress = models.TextField()
  excess_sedation = models.TextField()
  excess_sedation_distress = models.TextField()
  poor_concentration = models.TextField()
  poor_concentration_distress = models.TextField()
  trembling = models.TextField()
  trembling_distress = models.TextField()
  date = models.TextField()

  objects = SideEffectsSurveyResponseManager()

  class Meta:
    db_table = 'side_effects_survey_responses'
    managed = False
