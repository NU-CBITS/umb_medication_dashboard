import datetime, json
from django.utils.timezone import utc
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from .hh_participant_action import HhParticipantAction
from .participant_datum import ParticipantDatum
from .participant_check_in import ParticipantCheckIn
from .clinician_profile import ClinicianProfile

class Participant(models.Model):
    participant_id = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    clinician = models.ForeignKey(User, related_name='+')
    last_viewed_at = models.DateTimeField(auto_now=True)
    enrollment_date = models.DateField()

    def __unicode__(self):
        return self.participant_id

    def clinician_alerts(self):
        return self.heart2haart_clinician_alerts.all()

    def earliest_action(self):
        action = HhParticipantAction.objects.earliest(self.participant_id)
        return action[0].eventDateTime.replace(tzinfo=utc) if action else None

    def end_of_trial(self):
        return self.enrollment_date + datetime.timedelta(days=14)

    def latest_action(self):
        action = HhParticipantAction.objects.latest(self.participant_id)
        return action[0].eventDateTime.replace(tzinfo=timezone.get_current_timezone()) if action else None

    def latest_contact_page_message(self):
        message = HhParticipantAction.objects.latest_contact_page_message(self.participant_id)

        return message[0].eventDateTime.replace(tzinfo=utc) if message else None

    def latest_contact_page_messages(self):
        messages = HhParticipantAction.objects.latest_contact_page_message(self.participant_id)

        return (m.eventDateTime.replace(tzinfo=utc) for m in messages) if messages else []

    def dates_with_data_last_week(self):
        if not hasattr(self, 'dates_with_data_last_week_memo'):
            data = ParticipantDatum.objects.dates_with_data_last_week(self.participant_id)
            self.dates_with_data_last_week_memo = [d.eventDateTime.replace(tzinfo=timezone.get_current_timezone()) for d in data]

        return self.dates_with_data_last_week_memo

    def dates_with_actions_last_week(self):
        if not hasattr(self, 'dates_with_actions_last_week_memo'):
            actions = HhParticipantAction.objects.dates_with_actions_last_week(self.participant_id)
            self.dates_with_actions_last_week_memo = [a.eventDateTime.replace(tzinfo=timezone.get_current_timezone()) for a in actions]

        return self.dates_with_actions_last_week_memo

    def dates_with_check_ins_last_week(self):
        if not hasattr(self, 'dates_with_check_ins_last_week_memo'):
            check_ins = ParticipantCheckIn.objects.dates_with_check_ins_last_week(self.participant_id)
            self.dates_with_check_ins_last_week_memo = [c.eventDateTime.replace(tzinfo=timezone.get_current_timezone()) for c in check_ins]

        return self.dates_with_check_ins_last_week_memo

    def latest_dose_change(self):
        try:
            dose_change = self.heart2haart_dose_change_requests.order_by('-created_at')[0]
        except IndexError:
            dose_change = None

        return dose_change

    def latest_clinician_login(self):
        try:
            profile = ClinicianProfile.objects.get(clinician_id=self.clinician_id)
        except ClinicianProfile.DoesNotExist:
            profile = None

        return profile and profile.latest_check_in

    def latest_clinician_help_request(self):
        try:
            help_request = self.clinician.heart2haart_help_request.order_by('-created_at')[0]
        except IndexError:
            help_request = None

        return help_request and help_request.created_at

    def latest_clinician_help_requests(self):
        try:
            help_requests = self.clinician.heart2haart_help_request.order_by('-created_at')
        except IndexError:
            help_requests = []

        return (help_request.created_at for help_request in help_requests)

    class Meta:
        app_label = 'heart2haart'
