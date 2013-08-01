from django.db import models
from umb_dashboard.models import ParticipantModelManager

class ParticipantActionManager(ParticipantModelManager):
  def latest(self, participant_id):
    cursor = self.participant_db_cursor(participant_id)
    sql = self._select_latest_sql()

    return self.fetch_results(cursor, sql)

  def _select_latest_sql(self):
    return 'SELECT "id", "eventDateTime" FROM "medication_survey_responses" '\
      'UNION SELECT "id", "eventDateTime" FROM "side_effects_survey_responses" '\
      'UNION SELECT "id", "eventDateTime" FROM "symptoms_survey_responses" '\
      'UNION SELECT "id", "eventDateTime" FROM "sent_messages" '\
      'ORDER BY "eventDateTime" DESC LIMIT(1)'

class ParticipantAction(models.Model):
  eventDateTime = models.DateTimeField()

  objects = ParticipantActionManager()

  class Meta:
    managed = False
