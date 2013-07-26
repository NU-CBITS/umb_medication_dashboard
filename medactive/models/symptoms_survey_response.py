from django.db import models
from medactive.models.participant_model_manager import ParticipantModelManager

class SymptomsSurveyResponse(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  surveyVersion = models.BigIntegerField()
  timeStarted = models.TextField()
  index = models.TextField()
  paranoia_frequency = models.TextField()
  media_communication = models.TextField()
  media_communication_frequency = models.TextField()
  thought_insertion = models.TextField()
  thought_insertion_frequency = models.TextField()
  special_mission = models.TextField()
  special_mission_frequency = models.TextField()
  thought_broadcasting = models.TextField()
  thought_broadcasting_frequency = models.TextField()
  hallucinations = models.TextField()
  hallucinations_frequency = models.TextField()
  confused = models.TextField()
  confused_frequency = models.TextField()
  thought_disorders = models.TextField()
  thought_disorders_frequency = models.TextField()
  level_of_distress = models.TextField()
  date = models.TextField()

  objects = ParticipantModelManager()

  class Meta:
    db_table = 'symptoms_survey_responses'
    managed = False
