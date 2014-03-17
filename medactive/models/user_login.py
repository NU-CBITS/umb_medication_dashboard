from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.signals import user_logged_in

class UserLogin(models.Model):
    clinician = models.ForeignKey(User, related_name='+')
    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'medactive'

def log_login(sender, user, request, **kwargs):
    if user.groups.filter(name='MedActive Clinicians').exists():
        UserLogin.objects.create(clinician_id=user.id)

user_logged_in.connect(log_login)
