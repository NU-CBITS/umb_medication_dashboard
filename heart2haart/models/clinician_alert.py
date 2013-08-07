from django.db import models

class ClinicianAlert(models.Model):
  participant_id = models.CharField(max_length=255)
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
    app_label = 'heart2haart'
