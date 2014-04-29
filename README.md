in umb_dashboard/urls.py, wrap url patterns with:

    url(r'^umb/', include(patterns('',

in umb_dashboard/settings.py, change the following paths to their full local equivalents:

    "/var/www/django/umb_medication_dashboard/adherence_dashboard/assets"

    "/var/www/django/umb_medication_dashboard/templates"

start server locally:

    python manage.py runserver

open http://localhost:8000/umb/medactive
