from django.conf import settings
from django.db import models
import psycopg2

class ParticipantModelManager(models.Manager):
  def all_for_participant(self, participant_id):
    cursor = self.participant_db_cursor(participant_id)
    sql = self.select_sql(cursor)
    cursor.execute(sql)
    desc = cursor.description
    result_list = [
      self.model(**dict(zip([col[0] for col in desc], row)))
      for row in cursor.fetchall()
    ]

    return result_list

  def participant_db_cursor(self, participant_id):
    db_string = ('host=\'%(HOST)s\' dbname=\'' + self._db_name(participant_id) + \
      '\' user=\'%(USER)s\' password=\'%(PASSWORD)s\'') % settings.PARTICIPANT_DB
    connection = psycopg2.connect(db_string)
    
    return connection.cursor()

  def select_sql(self, cursor):
    col_name_query = 'SELECT column_name FROM information_schema.columns WHERE table_name=\'%s\';' % \
      self.model._meta.db_table
    cursor.execute(col_name_query)
    db_col_names = list(name[0] for name in cursor.fetchall())
    def alias(name):
      if 'FEATURE_VALUE_DT_' + name in db_col_names:
        return '"FEATURE_VALUE_DT_%s" AS "%s"' % (name, name)
      return '"%s"' % name
    cols = (alias(name) for name in model._meta.get_all_field_names())

    return 'SELECT %s FROM "%s";' % (', '.join(cols), model._meta.db_table)

  def _db_name(self, participant_id):
    return 'umb_' + participant_id
