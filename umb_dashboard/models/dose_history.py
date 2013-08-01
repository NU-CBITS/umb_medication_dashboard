from django.db import models
from .participant_model_manager import ParticipantModelManager

class DoseHistory(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  doses = models.TextField()

  objects = ParticipantModelManager()

  class Meta:
    db_table = 'doseHistory'
    managed = False
