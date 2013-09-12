from django.db import models

class ParticipantModelManager(models.Manager):
  PR_COLUMN_PREFIX = 'FEATURE_VALUE_DT_'

  def all_for_participant(self, participant_id):
    cursor = self.participant_db_cursor(participant_id)
    sql = self._select_all_sql(cursor)

    return self.fetch_results(cursor, sql)

  def participant_db_cursor(self, participant_id):
    from django.conf import settings
    import psycopg2
    db_string = ('host=\'%(HOST)s\' dbname=\'' + self._db_name(participant_id) + \
      '\' user=\'%(USER)s\' password=\'%(PASSWORD)s\'') % settings.PARTICIPANT_DB
    try:
      connection = psycopg2.connect(db_string)
    except Exception:
      return None
    else:
      return connection.cursor()

  def fetch_results(self, cursor, sql):
    try:
      cursor.execute(sql)
    except Exception:
      return []
    else:
      desc = cursor.description
      result_list = [
        self.model(**dict(zip([col[0] for col in desc], row)))
        for row in cursor.fetchall()
      ]

      return result_list

  def all_column_names(self, cursor):
    db_col_names = self.raw_column_names(cursor)
    def alias(name):
      if self.PR_COLUMN_PREFIX + name in db_col_names:
        return '"%s%s" AS "%s"' % (self.PR_COLUMN_PREFIX, name, name)
      elif name in db_col_names:
        return '"%s"' % name
    cols = (alias(name) for name in self.model._meta.get_all_field_names())

    return ', '.join(filter(None, cols))

  def raw_column_names(self, cursor):
    col_name_query = 'SELECT column_name FROM information_schema.columns WHERE table_name=\'%s\';' % \
      self.model._meta.db_table
    cursor.execute(col_name_query)

    return list(name[0] for name in cursor.fetchall())

  def all_table_names(self, cursor):
    if cursor:
      query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\';'
      cursor.execute(query)

      return list(name[0] for name in cursor.fetchall())
    else:
      return []

  def _select_all_sql(self, cursor):
    return 'SELECT %s FROM "%s";' % \
      (self.all_column_names(cursor), self.model._meta.db_table)

  def _db_name(self, participant_id):
    import hashlib
    return hashlib.md5(participant_id).hexdigest()
