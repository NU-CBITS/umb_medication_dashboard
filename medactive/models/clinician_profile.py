from django.db import models
from django.contrib.auth.models import User

class ClinicianProfile(models.Model):
  clinician = models.ForeignKey(User, related_name='medactive_profile')
  latest_check_in = models.DateTimeField(auto_now=True)

  class Meta:
    app_label = 'medactive'
