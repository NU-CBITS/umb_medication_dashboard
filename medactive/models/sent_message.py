from django.db import models
from medactive.models.participant_model_manager import ParticipantModelManager

class SentMessageManager(ParticipantModelManager):
  def all_in_context(self, participant_id, context, start_time):
    cursor = self.participant_db_cursor(participant_id)
    sql = self._select_all_in_context_sql(cursor, context, start_time)

    return self.fetch_results(cursor, sql)

  def _select_all_in_context_sql(self, cursor, context, start_time):
    columns = self.all_column_names(cursor)

    return 'SELECT %s FROM "%s" WHERE (%s);' % \
      (columns, self.model._meta.db_table, self._all_in_context_conditions(context, start_time))

  def _select_all_in_context_conditions(self, context, start_time):
    return '"eventDateTime" >= \'%s\' AND "context" = \'%s\'' %  \
      (start_time, context)

class SentMessage(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  context = models.TextField()
  date = models.TextField()

  objects = SentMessageManager()

  class Meta:
    db_table = 'sent_messages'
    managed = False
