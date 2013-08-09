from django.db import models
from django.contrib.auth.models import User
from .participant import Participant

class ClinicianAlert(models.Model):
  clinician = models.ForeignKey(User, related_name='+')
  participant = models.ForeignKey(Participant, related_name='medactive_clinician_alerts')
  type = models.CharField(max_length=255)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  is_cleared = models.BooleanField()
  contacted_patient = models.BooleanField()
  aware_of_issue = models.BooleanField()
  will_discuss = models.BooleanField()
  problem_details = models.TextField()
  participant_requests_contact = models.BooleanField()

  class Meta:
    app_label = 'medactive'
