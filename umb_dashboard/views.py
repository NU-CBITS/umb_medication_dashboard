from django.core import serializers
from django.http import HttpResponse
from django.contrib.auth.decorators import user_passes_test
import json
from umb_dashboard.models import DoseHistory, \
  MedPromptResponse, SentMessage

def is_clinician(user):
  return user.is_superuser or user.groups.extra(where=["name LIKE %s"], params=['%Clinicians']).exists()

def respond_with_json(query_set):
  json = serializers.serialize("json", query_set)
  return HttpResponse(json, content_type="application/json")

@user_passes_test(is_clinician)
def dose_history(request, participant_id):
  return respond_with_json(DoseHistory.objects.all_for_participant(participant_id))

@user_passes_test(is_clinician)
def med_prompt_survey_responses(request, participant_id):
  responses = MedPromptResponse.objects.all_for_participant(participant_id)
  return respond_with_json(responses)

@user_passes_test(is_clinician)
def sent_messages(request, participant_id):
  messages = SentMessage.objects.all_for_participant(participant_id)
  return respond_with_json(messages)
