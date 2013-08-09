import datetime
import json
from django.http import HttpResponse
from django.contrib.auth.decorators import user_passes_test
from umb_dashboard.views import respond_with_json
from umb_dashboard.models import MedPromptResponse, SentMessage
from medactive.models import SideEffectsSurveyResponse, \
  SymptomsSurveyResponse, ClinicianAlert, ClinicianProfile, Participant, \
  ParticipantAction

def is_clinician(user):
  return user.groups.filter(name='MedActive Clinicians').exists()

def is_researcher(user):
  return user.groups.filter(name='MedActive Researchers').exists()

@user_passes_test(is_clinician)
def participants(request):
  __check_in_clinician(request.user)
  return respond_with_json(Participant.objects.all())

def __check_in_clinician(clinician):
  profile, created = ClinicianProfile.objects.get_or_create(clinician_id=clinician.id)
  if created == False:
    profile.save()

@user_passes_test(is_clinician)
def side_effects_survey_responses(request, participant_id):
  responses = SideEffectsSurveyResponse.objects.all_for_participant(participant_id)
  return respond_with_json(responses)

@user_passes_test(is_clinician)
def symptoms_survey_responses(request, participant_id):
  responses = SymptomsSurveyResponse.objects.all_for_participant(participant_id)
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
  alert_types = ["non_adherence", "side_effects", "symptoms"]
  participant = Participant.objects.get(participant_id=participant_id)
  for alert_type in alert_types:
    alert = find_uncleared_alert(request.user.id, participant, alert_type)
    if alert != None:
      alerts.append(alert)
  return respond_with_json(alerts)

def find_uncleared_alert(clinician_id, participant, alert_type):
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
  elif alert_type == "symptoms":
    return pending_negative_symptoms_responses(last_alert_timestamp, participant)

def pending_negative_med_prompt_responses(last_alert_timestamp, participant):
  responses = MedPromptResponse.objects.negative_responses(participant.participant_id, start_time=last_alert_timestamp)
  details = (r.doseTime for r in responses)

  return filter(None, details)

def pending_negative_side_effects_responses(last_alert_timestamp, participant):
  HIGH_FREQ = 'Always'
  responses = SideEffectsSurveyResponse.objects.negative_responses(participant.participant_id, last_alert_timestamp)
  details = []
  details.append(next(("index" for r in responses if r.weight_concern_distress == HIGH_FREQ), None))
  details.append(next(("sexual_problems" for r in responses if r.sexual_problems_distress == HIGH_FREQ), None))
  details.append(next(("insomnia" for r in responses if r.insomnia_distress == HIGH_FREQ), None))
  details.append(next(("restlessness" for r in responses if r.restlessness_distress == HIGH_FREQ), None))
  details.append(next(("low_energy" for r in responses if r.low_energy_distress == HIGH_FREQ), None))
  details.append(next(("not_like_self" for r in responses if r.not_like_self_distress == HIGH_FREQ), None))
  details.append(next(("excess_sedation" for r in responses if r.excess_sedation_distress == HIGH_FREQ), None))
  details.append(next(("poor_concentration" for r in responses if r.poor_concentration_distress == HIGH_FREQ), None))
  details.append(next(("trembling" for r in responses if r.trembling_distress == HIGH_FREQ), None))

  return filter(None, details)

def pending_negative_symptoms_responses(last_alert_timestamp, participant):
  HIGH_FREQ = 'Almost all of the time'
  responses = SymptomsSurveyResponse.objects.negative_responses(participant.participant_id, last_alert_timestamp)
  details = []
  details.append(next(("index" for r in responses if r.paranoia_frequency == HIGH_FREQ), None))
  details.append(next(("media_communication" for r in responses if r.media_communication_frequency == HIGH_FREQ), None))
  details.append(next(("thought_insertion" for r in responses if r.thought_insertion_frequency == HIGH_FREQ), None))
  details.append(next(("special_mission" for r in responses if r.special_mission_frequency == HIGH_FREQ), None))
  details.append(next(("thought_broadcasting" for r in responses if r.thought_broadcasting_frequency == HIGH_FREQ), None))
  details.append(next(("hallucinations" for r in responses if r.hallucinations_frequency == HIGH_FREQ), None))
  details.append(next(("confused" for r in responses if r.confused_frequency == HIGH_FREQ), None))
  details.append(next(("thought_disorders" for r in responses if r.thought_disorders_frequency == HIGH_FREQ), None))

  return filter(None, details)

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
    'dates': dates
  }

  return render(request, 'cohort_summary.html', params)

@user_passes_test(is_clinician)
def contact_research_staff(request):
  from django.core.mail import send_mail
  from django.conf import settings
  send_mail('Clinician requires assistance', 'A clinician requires assistance',
    settings.DEFAULT_FROM_EMAIL, settings.RESEARCH_STAFF_EMAILS, fail_silently=True)
  request.user.medactive_help_request.create()

  return HttpResponse(status=200)
