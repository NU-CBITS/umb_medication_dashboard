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

class SentMessage(models.Model):
  id = models.TextField(primary_key=True)
  FEATURE_VALUE_DT_context = models.TextField()
  FEATURE_VALUE_DT_date = models.TextField()

  class Meta:
    db_table = 'sent_messages'

class ClinicianAlert(models.Model):
  participant_id = models.CharField()
  type = models.CharField()
  created_at = models.DateTimeField(auto_now_add=True)
  is_cleared = models.BooleanField()
  contacted_patient = models.BooleanField()
  aware_of_issue = models.BooleanField()
  will_discuss = models.BooleanField()

  class Meta:
    db_table = 'clinician_alerts'

  def __unicode__(self):
    return self.type
