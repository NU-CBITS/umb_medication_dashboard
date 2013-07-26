from django.db import models
from medactive.models.participant_model_manager import ParticipantModelManager

class SentMessage(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  context = models.TextField()
  date = models.TextField()

  objects = ParticipantModelManager()

  class Meta:
    db_table = 'sent_messages'
    managed = False
