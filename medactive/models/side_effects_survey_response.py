from django.db import models
from medactive.models.participant_model_manager import ParticipantModelManager

class SideEffectsSurveyResponse(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  surveyVersion = models.BigIntegerField()
  timeStarted = models.TextField()
  index = models.TextField()
  weight_concern_distress = models.TextField()
  sexual_problems = models.TextField()
  sexual_problems_distress = models.TextField()
  insomnia = models.TextField()
  insomnia_distress = models.TextField()
  restlessness = models.TextField()
  restlessness_distress = models.TextField()
  low_energy = models.TextField()
  low_energy_distress = models.TextField()
  not_like_self = models.TextField()
  not_like_self_distress = models.TextField()
  excess_sedation = models.TextField()
  excess_sedation_distress = models.TextField()
  poor_concentration = models.TextField()
  poor_concentration_distress = models.TextField()
  trembling = models.TextField()
  trembling_distress = models.TextField()
  date = models.TextField()

  objects = ParticipantModelManager()

  class Meta:
    db_table = 'side_effects_survey_responses'
    managed = False
