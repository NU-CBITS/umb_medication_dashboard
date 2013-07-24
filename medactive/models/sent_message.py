from django.db import models

class SentMessage(models.Model):
  id = models.TextField(primary_key=True)
  eventDateTime = models.DateTimeField()
  FEATURE_VALUE_DT_context = models.TextField()
  FEATURE_VALUE_DT_date = models.TextField()

  class Meta:
    db_table = 'sent_messages'
    managed = False
