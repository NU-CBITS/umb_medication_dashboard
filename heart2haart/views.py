import datetime, json
from django.http import HttpResponse
from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render
from umb_dashboard.views import respond_with_json
from umb_dashboard.models import ChangeMedicationRequest, MedPromptResponse, \
  SentMessage
from heart2haart.models import HhSideEffectsSurveyResponse, \
  MoodSurveyResponse, CravingsSurveyResponse, ClinicianAlert, ClinicianProfile, Participant, \
  DoseChangeRequest
from heart2haart.models.hh_participant_action import HhParticipantAction

def is_clinician(user):
  return user.is_superuser or user.groups.filter(name='Heart2HAART Clinicians').exists()

def is_researcher(user):
  return user.groups.filter(name='Heart2HAART Researchers').exists()

@user_passes_test(is_clinician)
def index(request):
  __check_in_clinician(request.user)

  return render(request, 'heart2haart_index.html')

def __check_in_clinician(clinician):
  profile, created = ClinicianProfile.objects.get_or_create(clinician_id=clinician.id)
  if created == False:
    profile.save()

@user_passes_test(is_clinician)
def participants(request):
  if request.user.is_superuser:
    return respond_with_json(Participant.objects.filter(clinician_id__isnull=False))
  else:
    return respond_with_json(Participant.objects.filter(clinician_id=request.user.id))

@user_passes_test(is_clinician)
def side_effects_survey_responses(request, participant_id):
  try:
    responses = HhSideEffectsSurveyResponse.objects.all_for_participant(participant_id)
    return respond_with_json(responses)
  except Exception:
    return HttpResponse("[]", content_type="application/json")

@user_passes_test(is_clinician)
def mood_survey_responses(request, participant_id):
  try:
    responses = MoodSurveyResponse.objects.all_for_participant(participant_id)
    return respond_with_json(responses)
  except Exception:
    return HttpResponse("[]", content_type="application/json")

@user_passes_test(is_clinician)
def cravings_survey_responses(request, participant_id):
  try:
    responses = CravingsSurveyResponse.objects.all_for_participant(participant_id)
    return respond_with_json(responses)
  except Exception:
    return HttpResponse("[]", content_type="application/json")

@user_passes_test(is_clinician)
def update_clinician_alert(request, participant_id, alert_id):
  from django.core import serializers
  for alert in serializers.deserialize("json", request.body):
    alert.save()
  return HttpResponse("{}", content_type="application/json")

@user_passes_test(is_clinician)
def uncleared_clinician_alerts(request, participant_id):
  try:
    alerts = []
    alert_types = ["non_adherence", "side_effects", "mood", "cravings"]
    participant = Participant.objects.get(participant_id=participant_id)
    for alert_type in alert_types:
      alert = find_uncleared_alert(request.user.id, participant, alert_type)
      if alert != None:
        alerts.append(alert)
    return respond_with_json(alerts)
  except Exception:
    return HttpResponse("[]", content_type="application/json")

def find_uncleared_alert(clinician_id, participant, alert_type):
  import datetime
  alert_manager = ClinicianAlert.objects
  alerts = alert_manager.filter(participant_id=participant.id, type=alert_type, is_cleared=False) or []
  if len(alerts) == 0:
    last_cleared_alerts = alert_manager.filter(participant_id=participant.id, type=alert_type, is_cleared=True).order_by('-created_at')[:1]
    last_alert_timestamp = datetime.datetime.min
    if len(last_cleared_alerts) == 1:
      last_alert_timestamp = last_cleared_alerts[0].updated_at
    details = pending_alert_details(last_alert_timestamp, participant, alert_type)
    if len(details) > 0:
      participant_requests_contact = any_contact_requests(last_alert_timestamp, participant, alert_type)
      alert = alert_manager.create(clinician_id=clinician_id, participant_id=participant.id, type=alert_type,
        problem_details=details, participant_requests_contact=participant_requests_contact)
      alerts.append(alert)
  if len(alerts) == 1:
    return alerts[0]
  return None

def pending_alert_details(last_alert_timestamp, participant, alert_type):
  if alert_type == "non_adherence":
    return pending_negative_med_prompt_responses(last_alert_timestamp, participant)
  elif alert_type == "side_effects":
    return pending_negative_side_effects_responses(last_alert_timestamp, participant)
  elif alert_type == "mood":
    return pending_negative_mood_responses(last_alert_timestamp, participant)
  elif alert_type == "cravings":
    return pending_negative_cravings_responses(last_alert_timestamp, participant)

def pending_negative_med_prompt_responses(last_alert_timestamp, participant):
  responses = MedPromptResponse.objects.negative_responses(participant.participant_id, start_time=last_alert_timestamp)
  details = (r.doseTime for r in responses)

  return filter(None, details)

def pending_negative_side_effects_responses(last_alert_timestamp, participant):
  responses = HhSideEffectsSurveyResponse.objects.negative_responses(participant.participant_id, last_alert_timestamp)
  details = []
  if len(responses):
    details.append('index')

  return details

def pending_negative_mood_responses(last_alert_timestamp, participant):
  NO_PROBLEMS = 'Not at all'
  responses = MoodSurveyResponse.objects.negative_responses(participant.participant_id, last_alert_timestamp)
  details = []
  details.append(next(("index" for r in responses if r.index != NO_PROBLEMS), None))
  details.append(next(("frequency" for r in responses if r.index != NO_PROBLEMS), None))

  return filter(None, details)

def pending_negative_cravings_responses(last_alert_timestamp, participant):
  responses = CravingsSurveyResponse.objects.negative_responses(participant.participant_id, last_alert_timestamp)
  details = []
  if len(responses):
    details.append('index')

  return details

def any_contact_requests(last_alert_timestamp, participant, alert_type):
  messages = SentMessage.objects.all_in_context(participant.participant_id, alert_type, last_alert_timestamp)

  return len(messages) > 0

@user_passes_test(is_clinician)
def latest_action(request, participant_id):
  return respond_with_json(HhParticipantAction.objects.latest(participant_id))

@user_passes_test(is_clinician)
def create_change_medication_request(request, participant_id):
  input = json.loads(request.body)
  change_request = ChangeMedicationRequest(participant_id, input['message'])
  change_request.save()
  status = { 'status': change_request.status }
  participant = Participant.objects.get(participant_id=participant_id)
  DoseChangeRequest.objects.create(clinician=request.user, participant=participant, message=input['message'])

  return HttpResponse(json.dumps(status), content_type="application/json")

@user_passes_test(is_researcher)
def cohort_summary(request):
  from django.shortcuts import render
  participants = Participant.objects.all()
  today = datetime.date.today()
  dates = [today - datetime.timedelta(days=x) for x in range(1, 8)]
  params = {
    'participants': participants,
    'dates': dates,
    'app_name': 'Heart2HAART'
  }

  return render(request, 'cohort_summary.html', params)

@user_passes_test(is_clinician)
def contact_research_staff(request):
  from django.core.mail import send_mail
  from django.conf import settings
  send_mail('Clinician requires assistance', 'A clinician requires assistance',
    settings.DEFAULT_FROM_EMAIL, settings.RESEARCH_STAFF_EMAILS, fail_silently=True)
  request.user.heart2haart_help_request.create()

  return HttpResponse(status=200)

@user_passes_test(is_clinician)
def log_clinician_view(request, participant_id):
  participant = Participant.objects.get(participant_id=participant_id)
  participant.save()

  return HttpResponse(status=200)
