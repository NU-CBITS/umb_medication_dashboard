from django.http import HttpResponse
from django.core import serializers
from django.views.decorators.cache import cache_page
from django.db.models import Q
import json
from medactive.models import MedPromptResponse, SideEffectsSurveyResponse, \
  SymptomsSurveyResponse, SentMessage, ClinicianAlert, ParticipantAction

def participants(request):
  participants = [
    "adam",
    "barbara",
    "chris",
    "dalila",
    "emmitt"
  ]
  participants_json = json.dumps(participants)
  return HttpResponse(participants_json, content_type="application/json")

@cache_page()
def med_prompt_survey_responses(request, participant_id):
  responses = MedPromptResponse.objects.using(participant_id).all()
  responses_json = serializers.serialize("json", responses)
  return HttpResponse(responses_json, content_type="application/json")

@cache_page()
def side_effects_survey_responses(request, participant_id):
  responses = SideEffectsSurveyResponse.objects.using(participant_id).all()
  responses_json = serializers.serialize("json", responses)
  return HttpResponse(responses_json, content_type="application/json")

@cache_page()
def symptoms_survey_responses(request, participant_id):
  responses = SymptomsSurveyResponse.objects.using(participant_id).all()
  responses_json = serializers.serialize("json", responses)
  return HttpResponse(responses_json, content_type="application/json")

@cache_page()
def sent_messages(request, participant_id):
  messages = SentMessage.objects.using(participant_id).all()
  messages_json = serializers.serialize("json", messages)
  return HttpResponse(messages_json, content_type="application/json")

def user_config(request, participant_id):
  names = {'adam':'Adam','barbara':'Barbara','chris':'Chris','dalila':'Dalila','emmitt':'Emmitt'}
  config = {
    "people":[
      {
        "id":participant_id,
        "type":"patient",
        "name":names[participant_id]
      }
    ],
    "doses":[
      {
        "time": "04:00:00",
        "medication":"Med1",
        "strength":"50",
        "dispensationUnit":"mg"
      },
      {
        "time":"18:15:00",
        "medication":"Med1",
        "strength":"50",
        "dispensationUnit":"mg"
      }
    ]
  }
  user_config_json = json.dumps(config)
  return HttpResponse(user_config_json, content_type="application/json")

def find_uncleared_alert(request, participant_id, alert_type):
  alerts = ClinicianAlert.objects.filter(participant_id=participant_id, type=alert_type, is_cleared=False)
  if len(alerts) == 0 and pending_alert_conditions(participant_id, alert_type):
    alerts = [ClinicianAlert.objects.create(participant_id=participant_id, type=alert_type)]
  alerts_json = serializers.serialize("json", alerts)
  return HttpResponse(alerts_json, content_type="application/json")

def pending_alert_conditions(participant_id, alert_type):
  last_cleared_alerts = ClinicianAlert.objects.filter(participant_id=participant_id, type=alert_type, is_cleared=True).order_by('-created_at')[:1]
  negative_responses = []
  if alert_type == "medication":
    negative_responses = pending_negative_med_prompt_responses(last_cleared_alerts, participant_id)
  elif alert_type == "side_effects":
    negative_responses = pending_negative_side_effects_responses(last_cleared_alerts, participant_id)
  elif alert_type == "symptoms":
    negative_responses = pending_negative_symptoms_responses(last_cleared_alerts, participant_id)
  return len(negative_responses) > 0

def pending_negative_med_prompt_responses(last_cleared_alerts, participant_id):
  responses = MedPromptResponse.objects.using(participant_id)
  if len(last_cleared_alerts) == 1:
    responses = responses.filter(eventDateTime__gte=last_cleared_alerts[0].created_at)
  return responses.filter(FEATURE_VALUE_DT_reason_for_missing='It makes me feel bad.')

def pending_negative_side_effects_responses(last_cleared_alerts, participant_id):
  responses = SideEffectsSurveyResponse.objects.using(participant_id)
  if len(last_cleared_alerts) == 1:
    responses = responses.filter(eventDateTime__gte=last_cleared_alerts[0].created_at)
  return responses.filter(Q(FEATURE_VALUE_DT_weight_concern_distress='Always')|Q(FEATURE_VALUE_DT_sexual_problems_distress='Always')|Q(FEATURE_VALUE_DT_insomnia_distress='Always')|Q(FEATURE_VALUE_DT_restlessness_distress='Always')|Q(FEATURE_VALUE_DT_low_energy_distress='Always')|Q(FEATURE_VALUE_DT_not_like_self_distress='Always')|Q(FEATURE_VALUE_DT_excess_sedation_distress='Always')|Q(FEATURE_VALUE_DT_poor_concentration_distress='Always')|Q(FEATURE_VALUE_DT_trembling_distress='Always'))

def pending_negative_symptoms_responses(last_cleared_alerts, participant_id):
  responses = SymptomsSurveyResponse.objects.using(participant_id)
  if len(last_cleared_alerts) == 1:
    responses = responses.filter(eventDateTime__gte=last_cleared_alerts[0].created_at)
  return responses.filter(Q(FEATURE_VALUE_DT_paranoia_frequency='Always')|Q(FEATURE_VALUE_DT_media_communication_frequency='Always')|Q(FEATURE_VALUE_DT_thought_insertion_frequency='Always')|Q(FEATURE_VALUE_DT_special_mission_frequency='Always')|Q(FEATURE_VALUE_DT_thought_broadcasting_frequency='Always')|Q(FEATURE_VALUE_DT_hallucinations_frequency='Always')|Q(FEATURE_VALUE_DT_confused_frequency='Always')|Q(FEATURE_VALUE_DT_thought_disorders_frequency='Always'))

@cache_page()
def latest_action(request, participant_id):
  actions = ParticipantAction.objects.raw('select "id", "eventDateTime" from "medication_survey_responses" '\
    'union select "id", "eventDateTime" from "side_effects_survey_responses" '\
    'union select "id", "eventDateTime" from "symptoms_survey_responses" '\
    'union select "id", "eventDateTime" from "sent_messages" '\
    'order by "eventDateTime" desc limit(1)').using(participant_id)
  actions_json = serializers.serialize("json", actions)
  return HttpResponse(actions_json, content_type="application/json")

def contact_research_staff(request):
  from django.core.mail import send_mail
  send_mail('Clinician requires assistance', 'A clinician requires assistance', 'from@example.com', ['to@example.com'], fail_silently=True)
