from django.conf import settings
import psycopg2

def participant_db_cursor(participant_id):
  db_string = ('host=\'%(HOST)s\' dbname=\'' + _db_name(participant_id) + \
    '\' user=\'%(USER)s\' password=\'%(PASSWORD)s\'') % settings.PARTICIPANT_DB
  connection = psycopg2.connect(db_string)
  
  return connection.cursor()

def _db_name(self, participant_id):
  return 'umb_' + participant_id

