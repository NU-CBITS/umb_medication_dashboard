from django.db import models
from django.contrib.auth.models import User
from .participant import Participant

class DoseChangeRequest(models.Model):
  clinician = models.ForeignKey(User, related_name='+')
  participant = models.ForeignKey(Participant, related_name='heart2haart_dose_change_requests')
  message = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    app_label = 'heart2haart'
