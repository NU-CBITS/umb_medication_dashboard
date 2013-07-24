from django.db import models

class ParticipantAction(models.Model):
  eventDateTime = models.DateTimeField()

  class Meta:
    managed = False
