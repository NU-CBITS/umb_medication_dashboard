import datetime
from django.db import models
from umb_dashboard.models import ParticipantModelManager

class ParticipantCheckInManager(ParticipantModelManager):
    def dates_with_check_ins_last_week(self, participant_id):
        cursor = self.participant_db_cursor(participant_id)
        sql = self.__select_dates_with_check_ins_last_week_sql()

        return self.fetch_results(cursor, sql) 

    def __select_dates_with_check_ins_last_week_sql(self):
        select = 'SELECT "id", "eventDateTime" FROM "participant_check_in"'
        today = datetime.date.today()

        return 'SELECT "eventDateTime" '\
            'FROM (SELECT ROW_NUMBER() OVER (PARTITION BY "eventDateTime"::date) AS row, '\
            '"t"."eventDateTime"::date FROM (%s) t) x '\
            'WHERE x.row = 1 AND "x"."eventDateTime" < \'%s\' AND "x"."eventDateTime" >= \'%s\';' % \
            (select, today, today - datetime.timedelta(days=7))

class ParticipantCheckIn(models.Model):
    eventDateTime = models.DateTimeField()

    objects = ParticipantCheckInManager()

    class Meta:
        managed = False

