from django.db import models
from django.contrib.auth.models import User
from .participant import Participant

class TabClick(models.Model):
    clinician = models.ForeignKey(User, related_name='+')
    participant = models.ForeignKey(Participant, related_name='+')
    occurred_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)

    class Meta:
        app_label = 'heart2haart'
