import datetime
from django.db import models
from .participant_model_manager import ParticipantModelManager

class DoseHistoryManager(ParticipantModelManager):
    def latest_dose_change(self, participant_id):
        cursor = self.participant_db_cursor(participant_id)
        sql = self.__select_latest_dose_change_sql()

        return self.fetch_results(cursor, sql) 

    def __select_latest_dose_change_sql(self):
        return 'SELECT "id", "eventDateTime", "doses" FROM "doseHistory" ORDER BY "eventDateTime" DESC LIMIT(1);'

class DoseHistory(models.Model):
    id = models.TextField(primary_key=True)
    eventDateTime = models.DateTimeField()
    doses = models.TextField()

    objects = DoseHistoryManager()

    class Meta:
        db_table = 'doseHistory'
        managed = False
