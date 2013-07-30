#!/usr/bin/env bash

ssh $UMB_SERVER '
cd /var/www/django/umb_medication_dashboard
git checkout -- umb_dashboard/settings.py
git pull origin master
cp ../config/settings.py umb_dashboard/
'
