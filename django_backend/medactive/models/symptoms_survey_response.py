from django.db import models

class SymptomsSurveyResponse(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  FEATURE_VALUE_DT_surveyVersion = models.BigIntegerField()
  FEATURE_VALUE_DT_timeStarted = models.TextField()
  FEATURE_VALUE_DT_index = models.TextField()
  FEATURE_VALUE_DT_paranoia_frequency = models.TextField()
  FEATURE_VALUE_DT_media_communication = models.TextField()
  FEATURE_VALUE_DT_media_communication_frequency = models.TextField()
  FEATURE_VALUE_DT_thought_insertion = models.TextField()
  FEATURE_VALUE_DT_thought_insertion_frequency = models.TextField()
  FEATURE_VALUE_DT_special_mission = models.TextField()
  FEATURE_VALUE_DT_special_mission_frequency = models.TextField()
  FEATURE_VALUE_DT_thought_broadcasting = models.TextField()
  FEATURE_VALUE_DT_thought_broadcasting_frequency = models.TextField()
  FEATURE_VALUE_DT_hallucinations = models.TextField()
  FEATURE_VALUE_DT_hallucinations_frequency = models.TextField()
  FEATURE_VALUE_DT_confused = models.TextField()
  FEATURE_VALUE_DT_confused_frequency = models.TextField()
  FEATURE_VALUE_DT_thought_disorders = models.TextField()
  FEATURE_VALUE_DT_thought_disorders_frequency = models.TextField()
  FEATURE_VALUE_DT_level_of_distress = models.TextField()
  FEATURE_VALUE_DT_date = models.TextField()

  class Meta:
    db_table = 'symptoms_survey_responses'
    managed = False
