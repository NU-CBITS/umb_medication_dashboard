from django.db import models

class SideEffectsSurveyResponse(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  FEATURE_VALUE_DT_surveyVersion = models.BigIntegerField()
  FEATURE_VALUE_DT_timeStarted = models.TextField()
  FEATURE_VALUE_DT_index = models.TextField()
  FEATURE_VALUE_DT_weight_concern_distress = models.TextField()
  FEATURE_VALUE_DT_sexual_problems = models.TextField()
  FEATURE_VALUE_DT_sexual_problems_distress = models.TextField()
  FEATURE_VALUE_DT_insomnia = models.TextField()
  FEATURE_VALUE_DT_insomnia_distress = models.TextField()
  FEATURE_VALUE_DT_restlessness = models.TextField()
  FEATURE_VALUE_DT_restlessness_distress = models.TextField()
  FEATURE_VALUE_DT_low_energy = models.TextField()
  FEATURE_VALUE_DT_low_energy_distress = models.TextField()
  FEATURE_VALUE_DT_not_like_self = models.TextField()
  FEATURE_VALUE_DT_not_like_self_distress = models.TextField()
  FEATURE_VALUE_DT_excess_sedation = models.TextField()
  FEATURE_VALUE_DT_excess_sedation_distress = models.TextField()
  FEATURE_VALUE_DT_poor_concentration = models.TextField()
  FEATURE_VALUE_DT_poor_concentration_distress = models.TextField()
  FEATURE_VALUE_DT_trembling = models.TextField()
  FEATURE_VALUE_DT_trembling_distress = models.TextField()
  FEATURE_VALUE_DT_date = models.TextField()

  class Meta:
    db_table = 'side_effects_survey_responses'
    managed = False
