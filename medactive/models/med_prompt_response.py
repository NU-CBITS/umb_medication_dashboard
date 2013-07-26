from django.db import models
from medactive.models.participant_model_manager import ParticipantModelManager

class MedPromptResponse(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  surveyVersion = models.BigIntegerField()
  timeStarted = models.TextField()
  index = models.TextField()
  date = models.TextField()
  reason_for_missing = models.TextField()
  doseTime = models.TextField()

  objects = ParticipantModelManager()

  class Meta:
    db_table = 'medication_survey_responses'
    managed = False
