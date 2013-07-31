from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^medactive$', 'medactive.views.group_summary'),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login'),
    url(r'^accounts/logout$', 'django.contrib.auth.views.logout', { 'next_page': '/umb/medactive' }),
    url(r'^medactive/participants$', 'medactive.views.participants'),
    url(r'^medactive/participants/([^/]+)/med_prompt_survey_responses$', 'medactive.views.med_prompt_survey_responses'),
    url(r'^medactive/participants/([^/]+)/side_effects_survey_responses$', 'medactive.views.side_effects_survey_responses'),
    url(r'^medactive/participants/([^/]+)/symptoms_survey_responses$', 'medactive.views.symptoms_survey_responses'),
    url(r'^medactive/participants/([^/]+)/sent_messages$', 'medactive.views.sent_messages'),
    url(r'^medactive/participants/([^/]+)/clinician_alerts$', 'medactive.views.uncleared_clinician_alerts'),
    url(r'^medactive/participants/([^/]+)/clinician_alerts/(\d+)$', 'medactive.views.update_clinician_alert'),
    url(r'^medactive/participants/([^/]+)/latest_action$', 'medactive.views.latest_action'),
    url(r'^medactive/participants/([^/]+)/dose_history$', 'medactive.views.dose_history'),
    url(r'^medactive/contact_research_staff$', 'medactive.views.contact_research_staff'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
