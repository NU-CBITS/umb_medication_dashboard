from django.http import HttpResponse
from django.views.decorators.cache import cache_page
from django.db.models import Q
from django.contrib.auth.decorators import login_required
import json
from umb_dashboard.views import respond_with_json
from medactive.models import MedPromptResponse, SideEffectsSurveyResponse, \
  SymptomsSurveyResponse, SentMessage, ClinicianAlert, DoseHistory, \
  ParticipantAction

@login_required
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

@login_required
#@cache_page()
def med_prompt_survey_responses(request, participant_id):
  responses = MedPromptResponse.objects.using(participant_id).all()
  return respond_with_json(responses)

@login_required
#@cache_page()
def side_effects_survey_responses(request, participant_id):
  responses = SideEffectsSurveyResponse.objects.using(participant_id).all()
  return respond_with_json(responses)

@login_required
#@cache_page()
def symptoms_survey_responses(request, participant_id):
  responses = SymptomsSurveyResponse.objects.using(participant_id).all()
  return respond_with_json(responses)

@login_required
#@cache_page()
def sent_messages(request, participant_id):
  messages = SentMessage.objects.using(participant_id).all()
  return respond_with_json(messages)

@login_required
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

@login_required
def uncleared_clinician_alerts(request, participant_id):
  alerts = []
  alert_types = ["non_adherence", "side_effects", "symptoms"]
  for alert_type in alert_types:
    alert = find_uncleared_alert(participant_id, alert_type)
    if alert != None:
      alerts.append(alert)
  return respond_with_json(alerts)

def find_uncleared_alert(participant_id, alert_type):
  alerts = ClinicianAlert.objects.filter(participant_id=participant_id, type=alert_type, is_cleared=False) or []
  if len(alerts) == 0:
    last_cleared_alerts = ClinicianAlert.objects.filter(participant_id=participant_id, type=alert_type, is_cleared=True).order_by('-created_at')[:1]
    last_alert_timestamp = None
    if len(last_cleared_alerts) == 1:
      last_alert_timestamp = last_cleared_alerts[0].updated_at
    details = pending_alert_details(last_alert_timestamp, participant_id, alert_type)
    if len(details) > 0:
      participant_requests_contact = any_contact_requests(last_alert_timestamp, participant_id, alert_type)
      alert = ClinicianAlert.objects.create(participant_id=participant_id, type=alert_type,
        problem_details=details, participant_requests_contact=participant_requests_contact)
      alerts.append(alert)
  if len(alerts) == 1:
    return alerts[0]
  return None

def pending_alert_details(last_alert_timestamp, participant_id, alert_type):
  if alert_type == "non_adherence":
    return pending_negative_med_prompt_responses(last_alert_timestamp, participant_id)
  elif alert_type == "side_effects":
    return pending_negative_side_effects_responses(last_alert_timestamp, participant_id)
  elif alert_type == "symptoms":
    return pending_negative_symptoms_responses(last_alert_timestamp, participant_id)

def pending_negative_med_prompt_responses(last_alert_timestamp, participant_id):
  responses = MedPromptResponse.objects.using(participant_id)
  if last_alert_timestamp != None:
    responses = responses.filter(eventDateTime__gte=last_alert_timestamp)
  responses = responses.filter(FEATURE_VALUE_DT_reason_for_missing='It makes me feel bad.')
  details = (r.FEATURE_VALUE_DT_doseTime for r in responses)
  return filter(None, details)

def pending_negative_side_effects_responses(last_alert_timestamp, participant_id):
  HIGH_FREQ = 'Always'
  responses = SideEffectsSurveyResponse.objects.using(participant_id)
  if last_alert_timestamp != None:
    responses = responses.filter(eventDateTime__gte=last_alert_timestamp)
  responses = responses.filter(Q(FEATURE_VALUE_DT_weight_concern_distress=HIGH_FREQ)|Q(FEATURE_VALUE_DT_sexual_problems_distress=HIGH_FREQ)|Q(FEATURE_VALUE_DT_insomnia_distress=HIGH_FREQ)|Q(FEATURE_VALUE_DT_restlessness_distress=HIGH_FREQ)|Q(FEATURE_VALUE_DT_low_energy_distress=HIGH_FREQ)|Q(FEATURE_VALUE_DT_not_like_self_distress=HIGH_FREQ)|Q(FEATURE_VALUE_DT_excess_sedation_distress=HIGH_FREQ)|Q(FEATURE_VALUE_DT_poor_concentration_distress=HIGH_FREQ)|Q(FEATURE_VALUE_DT_trembling_distress=HIGH_FREQ))
  details = []
  details.append(next(("index" for r in responses if r.FEATURE_VALUE_DT_weight_concern_distress == HIGH_FREQ), None))
  details.append(next(("sexual_problems" for r in responses if r.FEATURE_VALUE_DT_sexual_problems_distress == HIGH_FREQ), None))
  details.append(next(("insomnia" for r in responses if r.FEATURE_VALUE_DT_insomnia_distress == HIGH_FREQ), None))
  details.append(next(("restlessness" for r in responses if r.FEATURE_VALUE_DT_restlessness_distress == HIGH_FREQ), None))
  details.append(next(("low_energy" for r in responses if r.FEATURE_VALUE_DT_low_energy_distress == HIGH_FREQ), None))
  details.append(next(("not_like_self" for r in responses if r.FEATURE_VALUE_DT_not_like_self_distress == HIGH_FREQ), None))
  details.append(next(("excess_sedation" for r in responses if r.FEATURE_VALUE_DT_excess_sedation_distress == HIGH_FREQ), None))
  details.append(next(("poor_concentration" for r in responses if r.FEATURE_VALUE_DT_poor_concentration_distress == HIGH_FREQ), None))
  details.append(next(("trembling" for r in responses if r.FEATURE_VALUE_DT_trembling_distress == HIGH_FREQ), None))
  return filter(None, details)

def pending_negative_symptoms_responses(last_alert_timestamp, participant_id):
  HIGH_FREQ = 'Almost all of the time'
  responses = SymptomsSurveyResponse.objects.using(participant_id)
  if last_alert_timestamp != None:
    responses = responses.filter(eventDateTime__gte=last_alert_timestamp)
  responses = responses.filter(Q(FEATURE_VALUE_DT_paranoia_frequency=HIGH_FREQ)|Q(FEATURE_VALUE_DT_media_communication_frequency=HIGH_FREQ)|Q(FEATURE_VALUE_DT_thought_insertion_frequency=HIGH_FREQ)|Q(FEATURE_VALUE_DT_special_mission_frequency=HIGH_FREQ)|Q(FEATURE_VALUE_DT_thought_broadcasting_frequency=HIGH_FREQ)|Q(FEATURE_VALUE_DT_hallucinations_frequency=HIGH_FREQ)|Q(FEATURE_VALUE_DT_confused_frequency=HIGH_FREQ)|Q(FEATURE_VALUE_DT_thought_disorders_frequency=HIGH_FREQ))
  details = []
  details.append(next(("index" for r in responses if r.FEATURE_VALUE_DT_paranoia_frequency == HIGH_FREQ), None))
  details.append(next(("media_communication" for r in responses if r.FEATURE_VALUE_DT_media_communication_frequency == HIGH_FREQ), None))
  details.append(next(("thought_insertion" for r in responses if r.FEATURE_VALUE_DT_thought_insertion_frequency == HIGH_FREQ), None))
  details.append(next(("special_mission" for r in responses if r.FEATURE_VALUE_DT_special_mission_frequency == HIGH_FREQ), None))
  details.append(next(("thought_broadcasting" for r in responses if r.FEATURE_VALUE_DT_thought_broadcasting_frequency == HIGH_FREQ), None))
  details.append(next(("hallucinations" for r in responses if r.FEATURE_VALUE_DT_hallucinations_frequency == HIGH_FREQ), None))
  details.append(next(("confused" for r in responses if r.FEATURE_VALUE_DT_confused_frequency == HIGH_FREQ), None))
  details.append(next(("thought_disorders" for r in responses if r.FEATURE_VALUE_DT_thought_disorders_frequency == HIGH_FREQ), None))
  return filter(None, details)

def any_contact_requests(last_alert_timestamp, participant_id, alert_type):
  messages = SentMessage.objects.using(participant_id).filter(FEATURE_VALUE_DT_context=alert_type)
  if last_alert_timestamp != None:
    messages = messages.filter(eventDateTime__gte=last_alert_timestamp)
  return len(messages) > 0

@login_required
@cache_page()
def latest_action(request, participant_id):
  actions = ParticipantAction.objects.raw('select "id", "eventDateTime" from "medication_survey_responses" '\
    'union select "id", "eventDateTime" from "side_effects_survey_responses" '\
    'union select "id", "eventDateTime" from "symptoms_survey_responses" '\
    'union select "id", "eventDateTime" from "sent_messages" '\
    'order by "eventDateTime" desc limit(1)').using(participant_id)
  return respond_with_json(actions)

@login_required
def contact_research_staff(request):
  from django.core.mail import send_mail
  send_mail('Clinician requires assistance', 'A clinician requires assistance', 'from@example.com', ['to@example.com'], fail_silently=True)

@login_required
def dose_history(request, participant_id):
  doses = DoseHistory.objects.using(participant_id).all()
  return respond_with_json(doses)
