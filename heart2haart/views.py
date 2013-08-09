import datetime, json
from django.http import HttpResponse
from django.contrib.auth.decorators import user_passes_test
from umb_dashboard.views import respond_with_json
from umb_dashboard.models import MedPromptResponse, SentMessage
from heart2haart.models import SideEffectsSurveyResponse, \
  MoodSurveyResponse, CravingsSurveyResponse, ClinicianAlert, Participant, \
  ParticipantAction

def is_clinician(user):
  return user.groups.filter(name='Heart2HAART Clinicians').exists()

def is_researcher(user):
  return user.groups.filter(name='Heart2HAART Researchers').exists()

@user_passes_test(is_clinician)
def participants(request):
  return respond_with_json(Participant.objects.all())

@user_passes_test(is_clinician)
def side_effects_survey_responses(request, participant_id):
  responses = SideEffectsSurveyResponse.objects.all_for_participant(participant_id)
  return respond_with_json(responses)

@user_passes_test(is_clinician)
def mood_survey_responses(request, participant_id):
  responses = MoodSurveyResponse.objects.all_for_participant(participant_id)
  return respond_with_json(responses)

@user_passes_test(is_clinician)
def cravings_survey_responses(request, participant_id):
  responses = CravingsSurveyResponse.objects.all_for_participant(participant_id)
  return respond_with_json(responses)

@user_passes_test(is_clinician)
def update_clinician_alert(request, participant_id, alert_id):
  from django.core import serializers
  for alert in serializers.deserialize("json", request.body):
    alert.save()
  return HttpResponse()

@user_passes_test(is_clinician)
def uncleared_clinician_alerts(request, participant_id):
  alerts = []
  alert_types = ["non_adherence", "side_effects", "mood", "cravings"]
  participant = Participant.objects.get(participant_id=participant_id)
  for alert_type in alert_types:
    alert = find_uncleared_alert(request.user.id, participant, alert_type)
    if alert != None:
      alerts.append(alert)
  return respond_with_json(alerts)

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
  responses = SideEffectsSurveyResponse.objects.negative_responses(participant.participant_id, last_alert_timestamp)
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
  return respond_with_json(ParticipantAction.objects.latest(participant_id))

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
