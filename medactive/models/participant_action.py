import datetime
from django.db import models
from umb_dashboard.models import ParticipantModelManager

class ParticipantActionManager(ParticipantModelManager):
    TABLES = ['medication_survey_responses', 'side_effects_survey_responses',
        'symptoms_survey_responses', 'sent_messages']

    def earliest(self, participant_id):
        cursor = self.participant_db_cursor(participant_id)
        sql = self.__select_earliest_sql()

        return self.fetch_results(cursor, sql)

    def latest(self, participant_id):
        cursor = self.participant_db_cursor(participant_id)
        sql = self.__select_latest_sql()

        return self.fetch_results(cursor, sql)

    def latest_contact_page_message(self, participant_id):
        cursor = self.participant_db_cursor(participant_id)
        sql = 'SELECT "eventDateTime" FROM sent_messages WHERE "FEATURE_VALUE_DT_context" = \'contact_page\';'

        return self.fetch_results(cursor, sql)

    def dates_with_actions_last_week(self, participant_id):
        cursor = self.participant_db_cursor(participant_id)
        sql = self.__select_dates_with_actions_last_week_sql()

        return self.fetch_results(cursor, sql) 

    def __select_earliest_sql(self):
        return self.__select_actions_sql() + ' ORDER BY "eventDateTime" LIMIT(1);'

    def __select_latest_sql(self):
        return self.__select_actions_sql() + ' ORDER BY "eventDateTime" DESC LIMIT(1);'

    def __select_dates_with_actions_last_week_sql(self):
        selects = self.__select_actions_sql()
        today = datetime.date.today()

        return 'SELECT "eventDateTime" '\
            'FROM (SELECT ROW_NUMBER() OVER (PARTITION BY "eventDateTime"::date) AS row, '\
            '"t"."eventDateTime"::date FROM (%s) t) x '\
            'WHERE x.row = 1 AND "x"."eventDateTime" < \'%s\' AND "x"."eventDateTime" >= \'%s\';' % \
            (selects, today, today - datetime.timedelta(days=7))

    def __select_actions_sql(self):
        return ' UNION '.join([
            'SELECT "id", "eventDateTime" FROM "%s"' % table
            for table in self.TABLES
        ])

class ParticipantAction(models.Model):
    eventDateTime = models.DateTimeField()

    objects = ParticipantActionManager()

    class Meta:
        managed = False
