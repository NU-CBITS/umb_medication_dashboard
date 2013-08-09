from django.db import models
from django.contrib.auth.models import User

class ClinicianHelpRequest(models.Model):
  clinician = models.ForeignKey(User, related_name='medactive_help_request')
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    app_label = 'medactive'
