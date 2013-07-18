from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'umb_dashboard.views.home', name='home'),
    # url(r'^umb_dashboard/', include('umb_dashboard.foo.urls')),
    url(r'^medactive/participants.json$', 'medactive.views.participants'),
    url(r'^medactive/participants/(\w+)/user_config.json$', 'medactive.views.user_config'),
    url(r'^medactive/participants/(\w+)/med_prompt_survey_responses.json$', 'medactive.views.med_prompt_survey_responses'),
    url(r'^medactive/participants/(\w+)/side_effects_survey_responses.json$', 'medactive.views.side_effects_survey_responses'),
    url(r'^medactive/participants/(\w+)/symptoms_survey_responses.json$', 'medactive.views.symptoms_survey_responses'),
    url(r'^medactive/participants/(\w+)/sent_messages.json$', 'medactive.views.sent_messages'),
    url(r'^medactive/participants/(\w+)/clinician_alerts/(\w+).json$', 'medactive.views.find_uncleared_alert'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
