from django.core import serializers
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
import json
from umb_dashboard.models import ChangeMedicationRequest, DoseHistory, \
  MedPromptResponse, SentMessage

def respond_with_json(query_set):
  json = serializers.serialize("json", query_set)
  return HttpResponse(json, content_type="application/json")

@login_required
def create_change_medication_request(request, participant_id):
  input = json.loads(request.body)
  change_request = ChangeMedicationRequest(participant_id, input['message'])
  change_request.save()
  status = { 'status': change_request.status }

  return HttpResponse(json.dumps(status), content_type="application/json")

@login_required
def dose_history(request, participant_id):
  return respond_with_json(DoseHistory.objects.all_for_participant(participant_id))

@login_required
#@cache_page()
def med_prompt_survey_responses(request, participant_id):
  responses = MedPromptResponse.objects.all_for_participant(participant_id)
  return respond_with_json(responses)

@login_required
#@cache_page()
def sent_messages(request, participant_id):
  messages = SentMessage.objects.all_for_participant(participant_id)
  return respond_with_json(messages)

@login_required
def contact_research_staff(request):
  from django.core.mail import send_mail
  from django.conf import settings
  send_mail('Clinician requires assistance', 'A clinician requires assistance',
    settings.DEFAULT_FROM_EMAIL, settings.RESEARCH_STAFF_EMAILS, fail_silently=True)

  return HttpResponse(status=200)
