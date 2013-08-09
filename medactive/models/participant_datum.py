import datetime
from django.db import models
from umb_dashboard.models import ParticipantModelManager

class ParticipantDatumManager(ParticipantModelManager):
    def dates_with_data_last_week(self, participant_id):
        cursor = self.participant_db_cursor(participant_id)
        sql = self.__select_past_week_sql(cursor)

        return self.fetch_results(cursor, sql)

    # returns a set of single column rows, each with an 'eventDateTime' date
    def __select_past_week_sql(self, cursor):
        tables = self.all_table_names(cursor)
        selects = [
            'SELECT %s FROM "%s"' % \
                ('"eventDateTime"' if table != 'SourceValue' else '"insertedTime" AS "eventDateTime"', table)
            for table in tables
        ]
        today = datetime.date.today()

        return 'SELECT date '\
            'FROM (SELECT ROW_NUMBER() OVER (PARTITION BY "eventDateTime"::date) AS row, '\
            '"t"."eventDateTime"::date AS date FROM (%s) t) x '\
            'WHERE x.row = 1 AND x.date < \'%s\' AND x.date >= \'%s\';' % \
            (' UNION '.join(selects), today, today - datetime.timedelta(days=7))

class ParticipantDatum(models.Model):
    date = models.DateField()

    objects = ParticipantDatumManager()

    class Meta:
        managed = False
