import datetime, json
from django.db import models
from django.contrib.auth.models import User
from .participant_action import ParticipantAction
from .participant_datum import ParticipantDatum
from .participant_check_in import ParticipantCheckIn
from .clinician_profile import ClinicianProfile

class Participant(models.Model):
    participant_id = models.CharField(max_length=255)
    clinician = models.ForeignKey(User, related_name='+')
    last_viewed_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.participant_id

    def clinician_alerts(self):
        return self.medactive_clinician_alerts.all()

    def earliest_action(self):
        return ParticipantAction.objects.earliest(self.participant_id)[0].eventDateTime

    def end_of_trial(self):
        return self.earliest_action() + datetime.timedelta(days=14)

    def latest_action(self):
        return ParticipantAction.objects.latest(self.participant_id)[0].eventDateTime

    def latest_contact_page_message(self):
        return ParticipantAction.objects.latest_contact_page_message(self.participant_id)[0].eventDateTime

    def dates_with_data_last_week(self):
        if not hasattr(self, 'dates_with_data_last_week_memo'):
            data = ParticipantDatum.objects.dates_with_data_last_week(self.participant_id)
            self.dates_with_data_last_week_memo = [d.eventDateTime for d in data]

        return self.dates_with_data_last_week_memo

    def dates_with_actions_last_week(self):
        if not hasattr(self, 'dates_with_actions_last_week_memo'):
            actions = ParticipantAction.objects.dates_with_actions_last_week(self.participant_id)
            self.dates_with_actions_last_week_memo = [a.eventDateTime for a in actions]

        return self.dates_with_actions_last_week_memo

    def dates_with_check_ins_last_week(self):
        if not hasattr(self, 'dates_with_check_ins_last_week_memo'):
            check_ins = ParticipantCheckIn.objects.dates_with_check_ins_last_week(self.participant_id)
            self.dates_with_check_ins_last_week_memo = [c.eventDateTime for c in check_ins]

        return self.dates_with_check_ins_last_week_memo

    def latest_dose_change(self):
        try:
            dose_change = self.medactive_dose_change_requests.order_by('-created_at')[0]
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
            help_request = self.clinician.medactive_help_request.order_by('-created_at')[0]
        except IndexError:
            help_request = None

        return help_request and help_request.created_at

    class Meta:
        app_label = 'medactive'
