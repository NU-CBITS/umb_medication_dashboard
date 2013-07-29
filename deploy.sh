#!/usr/bin/env bash

ssh $UMB_SERVER 'cd /var/www/django/umb_medication_dashboard; git checkout -- umb_dashboard/settings.py; git pull origin master'
ssh $UMB_SERVER 'cp ~/settings.py /var/www/django/umb_medication_dashboard/umb_dashboard/'
ssh $UMB_SERVER 'sudo service apache2 restart'
