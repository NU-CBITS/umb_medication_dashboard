from django.db import models
from django.contrib.auth.models import User
from .participant_action import ParticipantAction
from .participant_datum import ParticipantDatum
from .participant_check_in import ParticipantCheckIn
from .clinician_profile import ClinicianProfile
from umb_dashboard.models import DoseHistory

class Participant(models.Model):
    participant_id = models.CharField(max_length=255)
    clinician = models.ForeignKey(User, related_name='+')

    def __unicode__(self):
        return self.participant_id

    def clinician_alerts(self):
        return self.heart2haart_clinician_alerts.all()

    def earliest_action(self):
        return ParticipantAction.objects.earliest(self.participant_id)[0].eventDateTime

    def latest_action(self):
        return ParticipantAction.objects.latest(self.participant_id)[0].eventDateTime

    def dates_with_data_last_week(self):
        if not hasattr(self, 'dates_with_data_last_week_memo'):
            data = ParticipantDatum.objects.dates_with_data_last_week(self.participant_id)
            self.dates_with_data_last_week_memo = [d.date for d in data]

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

    def dates_with_dose_changes_last_week(self):
        if not hasattr(self, 'dates_with_dose_changes_last_week_memo'):
            dose_changes = ParticipantCheckIn.objects.dates_with_dose_changes_last_week(self.participant_id)
            self.dates_with_dose_changes_last_week_memo = [d.eventDateTime for d in dose_changes]

        return self.dates_with_dose_changes_last_week_memo

    def latest_clinician_check_in(self):
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

    class Meta:
        app_label = 'heart2haart'
