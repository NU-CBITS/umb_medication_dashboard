from django.db import models

class DoseHistory(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  doses = models.TextField()

  class Meta:
    db_table = 'doseHistory'
    managed = False
