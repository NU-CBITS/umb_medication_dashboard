from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^accounts/login/$', 'django.contrib.auth.views.login'),

    # MedActive
    url(r'^medactive/logout$', 'django.contrib.auth.views.logout', { 'next_page': '/umb/accounts/login/?next=/umb/medactive' }),
    url(r'^medactive/?$', 'medactive.views.index'),
    url(r'^medactive/cohort_summary$', 'medactive.views.cohort_summary'),
    url(r'^medactive/participants$', 'medactive.views.participants'),
    url(r'^medactive/participants/([^/]+)/med_prompt_survey_responses$', 'umb_dashboard.views.med_prompt_survey_responses'),
    url(r'^medactive/participants/([^/]+)/side_effects_survey_responses$', 'medactive.views.side_effects_survey_responses'),
    url(r'^medactive/participants/([^/]+)/symptoms_survey_responses$', 'medactive.views.symptoms_survey_responses'),
    url(r'^medactive/participants/([^/]+)/sent_messages$', 'umb_dashboard.views.sent_messages'),
    url(r'^medactive/participants/([^/]+)/clinician_alerts$', 'medactive.views.uncleared_clinician_alerts'),
    url(r'^medactive/participants/([^/]+)/clinician_alerts/(\d+)$', 'medactive.views.update_clinician_alert'),
    url(r'^medactive/participants/([^/]+)/latest_action$', 'medactive.views.latest_action'),
    url(r'^medactive/participants/([^/]+)/dose_history$', 'umb_dashboard.views.dose_history'),
    url(r'^medactive/participants/([^/]+)/change_medication_requests$', 'medactive.views.create_change_medication_request'),
    url(r'^medactive/participants/([^/]+)/log_view', 'medactive.views.log_clinician_view'),
    url(r'^medactive/contact_research_staff$', 'medactive.views.contact_research_staff'),

    # Heart2HAART
    url(r'^heart2haart/logout$', 'django.contrib.auth.views.logout', { 'next_page': '/umb/accounts/login/?next=/umb/heart2haart' }),
    url(r'^heart2haart$', TemplateView.as_view(template_name='heart2haart_index.html')),
    url(r'^heart2haart/cohort_summary$', 'heart2haart.views.cohort_summary'),
    url(r'^heart2haart/participants$', 'heart2haart.views.participants'),
    url(r'^heart2haart/participants/([^/]+)/med_prompt_survey_responses$', 'umb_dashboard.views.med_prompt_survey_responses'),
    url(r'^heart2haart/participants/([^/]+)/side_effects_survey_responses$', 'heart2haart.views.side_effects_survey_responses'),
    url(r'^heart2haart/participants/([^/]+)/mood_survey_responses$', 'heart2haart.views.mood_survey_responses'),
    url(r'^heart2haart/participants/([^/]+)/cravings_survey_responses$', 'heart2haart.views.cravings_survey_responses'),
    url(r'^heart2haart/participants/([^/]+)/sent_messages$', 'umb_dashboard.views.sent_messages'),
    url(r'^heart2haart/participants/([^/]+)/clinician_alerts$', 'heart2haart.views.uncleared_clinician_alerts'),
    url(r'^heart2haart/participants/([^/]+)/clinician_alerts/(\d+)$', 'heart2haart.views.update_clinician_alert'),
    url(r'^heart2haart/participants/([^/]+)/latest_action$', 'heart2haart.views.latest_action'),
    url(r'^heart2haart/participants/([^/]+)/dose_history$', 'umb_dashboard.views.dose_history'),
    url(r'^heart2haart/participants/([^/]+)/change_medication_requests$', 'heart2haart.views.create_change_medication_request'),
    url(r'^heart2haart/participants/([^/]+)/log_view', 'heart2haart.views.log_clinician_view'),
    url(r'^heart2haart/contact_research_staff$', 'heart2haart.views.contact_research_staff'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
