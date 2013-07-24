from django.db import models

class MedPromptResponse(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  FEATURE_VALUE_DT_surveyVersion = models.BigIntegerField()
  FEATURE_VALUE_DT_timeStarted = models.TextField()
  FEATURE_VALUE_DT_index = models.TextField()
  FEATURE_VALUE_DT_date = models.TextField()
  FEATURE_VALUE_DT_reason_for_missing = models.TextField()
  FEATURE_VALUE_DT_doseTime = models.TextField()

  class Meta:
    db_table = 'medication_survey_responses'
    managed = False
