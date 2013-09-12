from django.core.management.base import BaseCommand, CommandError
from heart2haart.models.participant import Participant
import json, urllib2

class Command(BaseCommand):
    def handle(self, *args, **options):
        request = urllib2.urlopen('http://mohrlab.northwestern.edu/umb/integrations/users/?study_id=H2H')
        participants = json.loads(request.read())
        for participant in participants:
            Participant.objects.get_or_create(participant_id=participant['patient_id'])
