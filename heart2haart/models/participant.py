from django.db import models

class Participant(models.Model):
  participant_id = models.CharField(max_length=255)

  class Meta:
    app_label = 'heart2haart'
