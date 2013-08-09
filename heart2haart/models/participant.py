from django.db import models
from django.contrib.auth.models import User

class Participant(models.Model):
  participant_id = models.CharField(max_length=255)
  clinician = models.ForeignKey(User, related_name='+')

  def __unicode__(self):
    return self.participant_id

  class Meta:
    app_label = 'heart2haart'
