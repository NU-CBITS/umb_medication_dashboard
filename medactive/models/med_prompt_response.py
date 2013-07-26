from django.db import models
from medactive.models.db import participant_db_cursor

def select_sql(model, cursor):
  import re
  cursor.execute('SELECT column_name FROM information_schema.columns WHERE table_name=\'%s\';' % model._meta.db_table)
  db_col_names = list(name[0] for name in cursor.fetchall())
  def alias(name):
    if 'FEATURE_VALUE_DT_' + name in db_col_names:
      return '"FEATURE_VALUE_DT_%s" AS "%s"' % (name, name)
    return '"%s"' % name
  cols = (alias(name) for name in model._meta.get_all_field_names())

  return 'SELECT %s FROM "%s";' % (', '.join(cols), model._meta.db_table)

class MedPromptResponseManager(models.Manager):
  def all_for_participant(self, participant_id):
    cursor = participant_db_cursor(participant_id)
    sql = select_sql(self.model, cursor)
    cursor.execute(sql)
    desc = cursor.description
    result_list = [
      self.model(**dict(zip([col[0] for col in desc], row)))
      for row in cursor.fetchall()
    ]

    return result_list

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
